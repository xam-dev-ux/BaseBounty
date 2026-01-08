import React, { useState } from 'react';
import { useBounties } from '../hooks/useBounties';
import { Category, CategoryLabels, BountyStatus, StatusLabels } from '../types';
import { ethers } from 'ethers';

interface BountyListProps {
  onViewBounty: (bountyId: bigint) => void;
}

const BountyList: React.FC<BountyListProps> = ({ onViewBounty }) => {
  const { bounties, loading } = useBounties();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<BountyStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBounties = bounties.filter((bounty) => {
    const matchesCategory =
      selectedCategory === 'all' || bounty.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || bounty.status === selectedStatus;
    const matchesSearch =
      bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bounty.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

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

  const isExpired = (deadline: bigint) => {
    return Number(deadline) * 1000 < Date.now();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading bounties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">Available Bounties</h2>
        <p className="text-gray-400">{filteredBounties.length} bounties found</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search bounties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="input"
            >
              <option value="all">All Categories</option>
              {Object.entries(CategoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="input"
            >
              <option value="all">All Status</option>
              {Object.entries(StatusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bounty List */}
      {filteredBounties.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No bounties found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or create a new bounty
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBounties.map((bounty) => (
            <div
              key={bounty.id.toString()}
              className="card hover:border-primary-600 transition-colors cursor-pointer"
              onClick={() => onViewBounty(bounty.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {bounty.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">
                      {CategoryLabels[bounty.category]}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(bounty.status)}`}>
                      {StatusLabels[bounty.status]}
                    </span>
                    {isExpired(bounty.deadline) &&
                      bounty.status === BountyStatus.Active && (
                        <span className="badge badge-danger">Expired</span>
                      )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-2xl font-bold text-primary-400">
                    {ethers.formatEther(bounty.payment)} ETH
                  </p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {bounty.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                  <span>Deadline: </span>
                  <span className={isExpired(bounty.deadline) ? 'text-red-400' : ''}>
                    {new Date(Number(bounty.deadline) * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  Created{' '}
                  {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BountyList;
