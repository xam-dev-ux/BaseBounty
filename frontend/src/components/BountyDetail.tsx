import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Bounty, Application, BountyStatus, WorkStatus, CategoryLabels, StatusLabels } from '../types';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface BountyDetailProps {
  bountyId: bigint;
  onBack: () => void;
}

const BountyDetail: React.FC<BountyDetailProps> = ({ bountyId, onBack }) => {
  const { contract, account } = useWeb3();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [applicants, setApplicants] = useState<string[]>([]);
  const [applications, setApplications] = useState<Map<string, Application>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [coverLetter, setCoverLetter] = useState('');
  const [workUrl, setWorkUrl] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  // const [rating, setRating] = useState(5);
  // const [ratingComment, setRatingComment] = useState('');

  const fetchBountyDetails = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      const bountyData = await contract.getBounty(bountyId);
      const applicantAddresses = await contract.getBountyApplicants(bountyId);

      // Convert status to number to ensure it matches enum
      const status = Number(bountyData.status);

      setBounty({
        id: bountyData.id,
        creator: bountyData.creator,
        title: bountyData.title,
        description: bountyData.description,
        category: Number(bountyData.category),
        payment: bountyData.payment,
        deadline: bountyData.deadline,
        status: status,
        selectedWorker: bountyData.selectedWorker,
        createdAt: bountyData.createdAt,
      });

      setApplicants(applicantAddresses);

      // Fetch all applications (normalize addresses to lowercase)
      const appsMap = new Map<string, Application>();
      for (const addr of applicantAddresses) {
        const app = await contract.getApplication(bountyId, addr);
        appsMap.set(addr.toLowerCase(), {
          worker: app.worker,
          coverLetter: app.coverLetter,
          appliedAt: app.appliedAt,
          workStatus: app.workStatus,
          workSubmissionUrl: app.workSubmissionUrl,
          rejectionReason: app.rejectionReason,
        });
      }
      setApplications(appsMap);
    } catch (error) {
      console.error('Error fetching bounty details:', error);
      toast.error('Failed to load bounty details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBountyDetails();
  }, [contract, bountyId]);

  const handleApply = async () => {
    if (!contract || !coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await contract.applyToBounty(bountyId, coverLetter);
      toast.loading('Applying to bounty...', { id: 'apply' });
      await tx.wait();
      toast.success('Application submitted!', { id: 'apply' });
      setCoverLetter('');
      fetchBountyDetails();
    } catch (error: any) {
      console.error('Error applying:', error);
      toast.error(error.reason || 'Failed to apply', { id: 'apply' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWork = async () => {
    if (!contract || !workUrl.trim()) {
      toast.error('Please provide work URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await contract.submitWork(bountyId, workUrl);
      toast.loading('Submitting work...', { id: 'submit-work' });
      await tx.wait();
      toast.success('Work submitted!', { id: 'submit-work' });
      setWorkUrl('');
      fetchBountyDetails();
    } catch (error: any) {
      console.error('Error submitting work:', error);
      toast.error(error.reason || 'Failed to submit work', { id: 'submit-work' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptWork = async (workerAddress: string) => {
    if (!contract) return;

    setIsSubmitting(true);
    try {
      const tx = await contract.acceptWork(bountyId, workerAddress);
      toast.loading('Accepting work...', { id: 'accept' });
      await tx.wait();
      toast.success('Work accepted! Payment sent.', { id: 'accept' });
      fetchBountyDetails();
    } catch (error: any) {
      console.error('Error accepting work:', error);
      toast.error(error.reason || 'Failed to accept work', { id: 'accept' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectWork = async (workerAddress: string) => {
    if (!contract || !rejectionReason.trim()) {
      toast.error('Please provide rejection reason');
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await contract.rejectWork(bountyId, workerAddress, rejectionReason);
      toast.loading('Rejecting work...', { id: 'reject' });
      await tx.wait();
      toast.success('Work rejected', { id: 'reject' });
      setRejectionReason('');
      fetchBountyDetails();
    } catch (error: any) {
      console.error('Error rejecting work:', error);
      toast.error(error.reason || 'Failed to reject work', { id: 'reject' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rating functionality - to be implemented in future version
  // const handleRateUser = async (rateeAddress: string) => {
  //   if (!contract) return;
  //   setIsSubmitting(true);
  //   try {
  //     const tx = await contract.rateUser(bountyId, rateeAddress, rating, ratingComment);
  //     toast.loading('Submitting rating...', { id: 'rate' });
  //     await tx.wait();
  //     toast.success('Rating submitted!', { id: 'rate' });
  //     setRatingComment('');
  //     fetchBountyDetails();
  //   } catch (error: any) {
  //     console.error('Error rating user:', error);
  //     toast.error(error.reason || 'Failed to submit rating', { id: 'rate' });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const isCreator = account && bounty && account.toLowerCase() === bounty.creator.toLowerCase();
  const hasApplied = account && applications.has(account.toLowerCase());
  const myApplication = account ? applications.get(account.toLowerCase()) : null;

  // Debug info - temporary
  useEffect(() => {
    if (bounty && account) {
      console.log('🔍 BountyDetail Debug:', {
        bountyId: bountyId.toString(),
        bountyStatus: bounty.status,
        bountyStatusType: typeof bounty.status,
        bountyStatusLabel: StatusLabels[bounty.status],
        BountyStatusActive: BountyStatus.Active,
        isStatusActive: bounty.status === BountyStatus.Active,
        isStatusNotActive: bounty.status !== BountyStatus.Active,
        isCreator,
        hasApplied,
        myAccount: account,
        creator: bounty.creator,
        applicantsCount: applicants.length,
        canApply: !isCreator && bounty.status === BountyStatus.Active && !hasApplied
      });
    }
  }, [bounty, account, isCreator, hasApplied, applicants.length]);

  if (loading || !bounty) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading bounty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="btn-secondary">
        ← Back to Bounties
      </button>

      {/* Bounty Info */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-3">{bounty.title}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">{CategoryLabels[bounty.category]}</span>
              <span className={`badge ${bounty.status === BountyStatus.Active ? 'badge-success' : 'badge-info'}`}>
                {StatusLabels[bounty.status]}
              </span>
            </div>
          </div>
          <div className="text-right ml-4">
            <p className="text-3xl font-bold text-primary-400">
              {ethers.formatEther(bounty.payment)} ETH
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Worker receives: {ethers.formatEther(bounty.payment * 98n / 100n)} ETH
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{bounty.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-500">Creator</p>
              <p className="text-sm font-mono text-gray-300">
                {bounty.creator.slice(0, 6)}...{bounty.creator.slice(-4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-sm text-gray-300">
                {new Date(Number(bounty.deadline) * 1000).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm text-gray-300">
                {new Date(Number(bounty.createdAt) * 1000).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Applicants</p>
              <p className="text-sm text-gray-300">{applicants.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove after testing */}
      {!isCreator && process.env.NODE_ENV === 'development' && (
        <div className="card bg-yellow-900/20 border border-yellow-700">
          <p className="text-yellow-400 font-semibold mb-2">🐛 Debug Info (Development Only)</p>
          <div className="text-xs text-yellow-300 space-y-1">
            <p>Status: {bounty.status} ({StatusLabels[bounty.status]})</p>
            <p>Status Type: {typeof bounty.status}</p>
            <p>Is Active: {bounty.status === BountyStatus.Active ? 'YES' : 'NO'}</p>
            <p>Has Applied: {hasApplied ? 'YES' : 'NO'}</p>
            <p>Can Apply: {!isCreator && bounty.status === BountyStatus.Active && !hasApplied ? 'YES' : 'NO'}</p>
          </div>
        </div>
      )}

      {/* Worker Actions - Apply to Bounty */}
      {!isCreator && bounty.status === BountyStatus.Active && !hasApplied && (
        <div className="card bg-primary-900/20 border-2 border-primary-600">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white">Apply to this Bounty</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Explain why you're the best person for this task. Include relevant experience and how you plan to complete it.
          </p>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your application here... (e.g., 'I have 5 years of experience in...')"
            rows={5}
            className="textarea mb-4"
          />
          <button onClick={handleApply} disabled={isSubmitting || !coverLetter.trim()} className="btn-primary w-full text-lg py-3">
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </div>
      )}

      {/* Info message when user can't apply */}
      {!isCreator && bounty.status === BountyStatus.Active && hasApplied && !myApplication && (
        <div className="card bg-blue-900/20 border border-blue-700">
          <p className="text-blue-400">You have already applied to this bounty. Your application is being reviewed.</p>
        </div>
      )}

      {!isCreator && bounty.status !== BountyStatus.Active && (
        <div className="card bg-gray-700/50 border border-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-400">
              {bounty.status === BountyStatus.Completed && "This bounty has been completed and is no longer accepting applications."}
              {bounty.status === BountyStatus.Cancelled && "This bounty has been cancelled and is no longer accepting applications."}
              {bounty.status === BountyStatus.InDispute && "This bounty is in dispute and is not accepting new applications."}
            </p>
          </div>
        </div>
      )}

      {isCreator && bounty.status === BountyStatus.Active && (
        <div className="card bg-gray-700/50 border border-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-gray-400">You are the creator of this bounty. Review applications below.</p>
          </div>
        </div>
      )}

      {/* My Application */}
      {!isCreator && hasApplied && myApplication && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Your Application</h3>
          <p className="text-gray-400 mb-4">{myApplication.coverLetter}</p>
          <div className="text-sm text-gray-500">
            Applied: {new Date(Number(myApplication.appliedAt) * 1000).toLocaleString()}
          </div>

          {myApplication.workStatus === WorkStatus.NotSubmitted && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Submit Your Work</h4>
              <input
                type="text"
                value={workUrl}
                onChange={(e) => setWorkUrl(e.target.value)}
                placeholder="URL or IPFS hash of your completed work"
                className="input mb-2"
              />
              <button onClick={handleSubmitWork} disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Submitting...' : 'Submit Work'}
              </button>
            </div>
          )}

          {myApplication.workStatus === WorkStatus.Submitted && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-400">Work submitted, waiting for review</p>
              <p className="text-sm text-gray-400 mt-1">URL: {myApplication.workSubmissionUrl}</p>
            </div>
          )}

          {myApplication.workStatus === WorkStatus.Accepted && (
            <div className="mt-4 bg-green-900/20 border border-green-700 rounded-lg p-4">
              <p className="text-green-400">Work accepted! Payment received.</p>
            </div>
          )}

          {myApplication.workStatus === WorkStatus.Rejected && (
            <div className="mt-4 bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">Work rejected</p>
              <p className="text-sm text-gray-400 mt-1">Reason: {myApplication.rejectionReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Creator View: Applications */}
      {isCreator && applicants.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-white mb-4">Applications ({applicants.length})</h3>
          <div className="space-y-4">
            {applicants.map((addr) => {
              const app = applications.get(addr.toLowerCase());
              if (!app) return null;

              return (
                <div key={addr} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-mono text-sm text-gray-300">
                      {addr.slice(0, 10)}...{addr.slice(-8)}
                    </p>
                    <span className={`badge ${
                      app.workStatus === WorkStatus.Accepted ? 'badge-success' :
                      app.workStatus === WorkStatus.Submitted ? 'badge-warning' :
                      app.workStatus === WorkStatus.Rejected ? 'badge-danger' :
                      'badge-primary'
                    }`}>
                      {app.workStatus === WorkStatus.NotSubmitted ? 'Applied' :
                       app.workStatus === WorkStatus.Submitted ? 'Work Submitted' :
                       app.workStatus === WorkStatus.Accepted ? 'Accepted' : 'Rejected'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{app.coverLetter}</p>

                  {app.workStatus === WorkStatus.Submitted && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-300 mb-1">Submitted Work:</p>
                        <a
                          href={app.workSubmissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-400 text-sm hover:underline"
                        >
                          {app.workSubmissionUrl}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptWork(addr)}
                          disabled={isSubmitting}
                          className="btn-primary flex-1"
                        >
                          Accept & Pay
                        </button>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Rejection reason"
                            className="input mb-2"
                          />
                          <button
                            onClick={() => handleRejectWork(addr)}
                            disabled={isSubmitting}
                            className="btn-danger w-full"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BountyDetail;
