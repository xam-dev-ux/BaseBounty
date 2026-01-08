import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { UserReputation } from '../types';

export const useReputation = (address?: string) => {
  const { contract, account } = useWeb3();
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const targetAddress = address || account;

  const fetchReputation = async () => {
    if (!contract || !targetAddress) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const rep = await contract.getUserReputation(targetAddress);
      const avgRating = await contract.getAverageRating(targetAddress);

      setReputation({
        totalRatings: rep.totalRatings,
        sumOfRatings: rep.sumOfRatings,
        completedBounties: rep.completedBounties,
        completedWorks: rep.completedWorks,
        totalEarned: rep.totalEarned,
        totalSpent: rep.totalSpent,
      });

      setAverageRating(Number(avgRating) / 100);
    } catch (error) {
      console.error('Error fetching reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReputation();
  }, [contract, targetAddress]);

  const refreshReputation = () => {
    fetchReputation();
  };

  return { reputation, averageRating, loading, refreshReputation };
};
