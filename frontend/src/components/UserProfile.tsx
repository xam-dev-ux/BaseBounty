import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useReputation } from '../hooks/useReputation';
import { Bounty, BountyStatus, CategoryLabels, StatusLabels } from '../types';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface UserProfileProps {
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
  const { contract, account } = useWeb3();
  const { reputation, averageRating, loading: repLoading } = useReputation();
  const [createdBounties, setCreatedBounties] = useState<Bounty[]>([]);
  const [appliedBounties, setAppliedBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'applied'>('created');

  useEffect(() => {
    fetchUserBounties();
  }, [contract, account]);

  const fetchUserBounties = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);

      // Fetch created bounties
      const createdIds = await contract.getUserCreatedBounties(account);
      const created: Bounty[] = [];
      for (const id of createdIds) {
        try {
          const bounty = await contract.getBounty(id);
          created.push({
            id: bounty.id,
            creator: bounty.creator,
            title: bounty.title,
            description: bounty.description,
            category: bounty.category,
            payment: bounty.payment,
            deadline: bounty.deadline,
            status: bounty.status,
            selectedWorker: bounty.selectedWorker,
            createdAt: bounty.createdAt,
          });
        } catch (error) {
          console.error(`Error fetching bounty ${id}:`, error);
        }
      }
      setCreatedBounties(created.reverse());

      // Fetch applied bounties
      const appliedIds = await contract.getUserAppliedBounties(account);
      const applied: Bounty[] = [];
      for (const id of appliedIds) {
        try {
          const bounty = await contract.getBounty(id);
          applied.push({
            id: bounty.id,
            creator: bounty.creator,
            title: bounty.title,
            description: bounty.description,
            category: bounty.category,
            payment: bounty.payment,
            deadline: bounty.deadline,
            status: bounty.status,
            selectedWorker: bounty.selectedWorker,
            createdAt: bounty.createdAt,
          });
        } catch (error) {
          console.error(`Error fetching bounty ${id}:`, error);
        }
      }
      setAppliedBounties(applied.reverse());
    } catch (error) {
      console.error('Error fetching user bounties:', error);
      toast.error('Failed to load user bounties');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-600">
            ★
          </span>
        );
      }
    }

    return stars;
  };

  const getStatusBadgeClass = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.Active:
        return 'badge-success';
      case BountyStatus.Completed:
        return 'badge-info';
      case BountyStatus.Cancelled:
        return 'badge-danger';
      case BountyStatus.InDispute:
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  if (repLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={onBack} className="btn-secondary">
        ← Back
      </button>

      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="font-mono text-gray-400">{account}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-2">
              {renderStars(averageRating)}
              <span className="text-2xl font-bold text-white ml-2">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {reputation?.totalRatings.toString() || '0'} ratings
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Completed Bounties</p>
            <p className="text-2xl font-bold text-primary-400">
              {reputation?.completedBounties.toString() || '0'}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Completed Works</p>
            <p className="text-2xl font-bold text-primary-400">
              {reputation?.completedWorks.toString() || '0'}
            </p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-green-400">
              {reputation ? ethers.formatEther(reputation.totalEarned) : '0'}
            </p>
            <p className="text-xs text-gray-500">ETH</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-blue-400">
              {reputation ? ethers.formatEther(reputation.totalSpent) : '0'}
            </p>
            <p className="text-xs text-gray-500">ETH</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Created</p>
            <p className="text-2xl font-bold text-white">{createdBounties.length}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Applied</p>
            <p className="text-2xl font-bold text-white">{appliedBounties.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'created'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Created Bounties ({createdBounties.length})
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'applied'
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Applied Bounties ({appliedBounties.length})
        </button>
      </div>

      {/* Bounties List */}
      <div>
        {activeTab === 'created' && (
          <div className="space-y-4">
            {createdBounties.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No bounties created yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first bounty to get started
                </p>
              </div>
            ) : (
              createdBounties.map((bounty) => (
                <div key={bounty.id.toString()} className="card hover:border-primary-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge badge-primary">
                          {CategoryLabels[bounty.category]}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(bounty.status)}`}>
                          {StatusLabels[bounty.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{bounty.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-400">
                        {ethers.formatEther(bounty.payment)} ETH
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                    <div>
                      Created: {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}
                    </div>
                    <div>
                      Deadline: {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'applied' && (
          <div className="space-y-4">
            {appliedBounties.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No applications yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Browse bounties and apply to start working
                </p>
              </div>
            ) : (
              appliedBounties.map((bounty) => (
                <div key={bounty.id.toString()} className="card hover:border-primary-600 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge badge-primary">
                          {CategoryLabels[bounty.category]}
                        </span>
                        <span className={`badge ${getStatusBadgeClass(bounty.status)}`}>
                          {StatusLabels[bounty.status]}
                        </span>
                        {bounty.selectedWorker.toLowerCase() === account?.toLowerCase() && (
                          <span className="badge badge-success">You Won!</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{bounty.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-400">
                        {ethers.formatEther(bounty.payment)} ETH
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                    <div>Creator: {bounty.creator.slice(0, 6)}...{bounty.creator.slice(-4)}</div>
                    <div>
                      Deadline: {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
