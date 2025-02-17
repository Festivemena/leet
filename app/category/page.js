'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';

const socket = io('https://bevs.onrender.com'); // Adjust based on your backend URL

export default function VotingSystem() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidates
        const candidatesRes = await fetch('https://bevs.onrender.com/candidates');
        const candidatesData = await candidatesRes.json();

        // Extract unique categories from candidates
        const categorySet = new Set();
        const updatedCandidates = candidatesData.map((candidate) => {
          categorySet.add(candidate.category);
          return {
            ...candidate,
            categoryName: candidate.category || 'Unknown',
          };
        });

        setCandidates(updatedCandidates);
        setCategories([...categorySet].map((name, index) => ({ _id: index.toString(), name })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Listen for real-time vote updates
    socket.on('voteUpdate', (updatedVotes) => {
      setVotes(updatedVotes);
    });
  }, []);

  const handleCategorySelect = (categoryId) => {
    router.push(`/vote/${categoryId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-md p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Vote for Your Favorite Candidate</h2>
        <div className="space-y-4">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white/20 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-lg">{category.name}</span>
                    <Button
                      onClick={() => handleCategorySelect(category._id)}
                      variant="outline"
                      className="border-white/50 text-white hover:bg-white/20"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
