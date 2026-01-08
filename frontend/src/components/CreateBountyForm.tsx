import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Category, CategoryLabels } from '../types';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface CreateBountyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateBountyForm: React.FC<CreateBountyFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { contract } = useWeb3();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: Category.Other,
    payment: '',
    deadline: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contract) {
      toast.error('Contract not initialized');
      return;
    }

    // Validation
    if (!formData.title || !formData.description || !formData.payment || !formData.deadline) {
      toast.error('Please fill in all fields');
      return;
    }

    const paymentInWei = ethers.parseEther(formData.payment);
    const minBountyAmount = await contract.MIN_BOUNTY_AMOUNT();

    if (paymentInWei < minBountyAmount) {
      toast.error(
        `Minimum bounty amount is ${ethers.formatEther(minBountyAmount)} ETH`
      );
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

    if (deadlineTimestamp <= now) {
      toast.error('Deadline must be in the future');
      return;
    }

    setIsSubmitting(true);

    try {
      const tx = await contract.createBounty(
        formData.title,
        formData.description,
        formData.category,
        deadlineTimestamp,
        { value: paymentInWei }
      );

      toast.loading('Creating bounty...', { id: 'create-bounty' });
      await tx.wait();

      toast.success('Bounty created successfully!', { id: 'create-bounty' });
      onSuccess();
    } catch (error: any) {
      console.error('Error creating bounty:', error);
      toast.error(error.reason || 'Failed to create bounty', {
        id: 'create-bounty',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Create New Bounty</h2>
          <p className="text-gray-400">
            Post a task and let workers apply to complete it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Design a modern logo for my startup"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed requirements, deliverables, and any specific instructions..."
              rows={6}
              className="textarea"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Be as specific as possible to attract the right workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input"
                required
              >
                {Object.entries(CategoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment (ETH) *
              </label>
              <input
                type="number"
                name="payment"
                value={formData.payment}
                onChange={handleInputChange}
                placeholder="0.1"
                step="0.000001"
                min="0.000001"
                className="input"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum: 0.000001 ETH (2% platform fee applies)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={getTomorrowDate()}
              className="input"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Set a realistic deadline for task completion
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-white">Summary</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                Payment to worker:{' '}
                <span className="text-primary-400 font-semibold">
                  {formData.payment
                    ? (parseFloat(formData.payment) * 0.98).toFixed(4)
                    : '0'}{' '}
                  ETH
                </span>
              </p>
              <p>
                Platform fee (2%):{' '}
                <span className="text-gray-400">
                  {formData.payment
                    ? (parseFloat(formData.payment) * 0.02).toFixed(4)
                    : '0'}{' '}
                  ETH
                </span>
              </p>
              <p className="pt-2 border-t border-gray-600">
                Total amount locked:{' '}
                <span className="text-white font-bold">
                  {formData.payment || '0'} ETH
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Bounty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBountyForm;
