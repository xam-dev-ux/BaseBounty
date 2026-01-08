import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Bounty } from '../types';
import toast from 'react-hot-toast';

export const useBounties = () => {
  const { contract } = useWeb3();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBounties = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const totalBounties = await contract.getTotalBounties();
      const total = Number(totalBounties);

      const bountiesData: Bounty[] = [];

      for (let i = total; i > 0; i--) {
        try {
          const bounty = await contract.getBounty(i);
          bountiesData.push({
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
          console.error(`Error fetching bounty ${i}:`, error);
        }
      }

      setBounties(bountiesData);
    } catch (error) {
      console.error('Error fetching bounties:', error);
      toast.error('Failed to load bounties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, [contract]);

  const refreshBounties = () => {
    fetchBounties();
  };

  return { bounties, loading, refreshBounties };
};
