import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { techStackAPI } from '@/api';

const AIInterviewerControls = ({ interviewId }) => {
  const [selectedTechStack, setSelectedTechStack] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [techStacks, setTechStacks] = useState([]);
  const { toast } = useToast();

  // Fetch tech stacks on component mount
  useEffect(() => {
    fetchTechStacks();
  }, []);

  const fetchTechStacks = async () => {
    try {
      const response = await techStackAPI.getAll();
      if (response.data && response.data.data) {
        setTechStacks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tech stacks",
        variant: "destructive",
      });
    }
  };

  const initializeInterviewer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-interviewer/${interviewId}/initialize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ domain: selectedTechStack })
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsInitialized(true);
        toast({
          title: "Success",
          description: "AI interviewer initialized successfully",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize AI interviewer",
        variant: "destructive",
      });
    }
  };

  const startInterview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-interviewer/${interviewId}/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsInterviewing(true);
        toast({
          title: "Success",
          description: "Interview started",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to start interview",
        variant: "destructive",
      });
    }
  };

  const pauseInterview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-interviewer/${interviewId}/pause`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsInterviewing(false);
        toast({
          title: "Success",
          description: "Interview paused",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to pause interview",
        variant: "destructive",
      });
    }
  };

  const resumeInterview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-interviewer/${interviewId}/resume`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsInterviewing(true);
        toast({
          title: "Success",
          description: "Interview resumed",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resume interview",
        variant: "destructive",
      });
    }
  };

  const endInterview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai-interviewer/${interviewId}/end`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsInitialized(false);
        setIsInterviewing(false);
        toast({
          title: "Success",
          description: "Interview ended",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to end interview",
        variant: "destructive",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-white">Initialize AI Interviewer</h3>
        <div className="space-y-2">
          <Label htmlFor="techStack">Select Tech Stack</Label>
          <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
            <SelectTrigger>
              <SelectValue placeholder="Select a tech stack" />
            </SelectTrigger>
            <SelectContent>
              {techStacks.map((stack) => (
                <SelectItem key={stack._id} value={stack.name}>
                  {stack.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={initializeInterviewer} 
          className="w-full"
          disabled={!selectedTechStack}
        >
          Initialize AI Interviewer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-white">AI Interviewer Controls</h3>
      <div className="flex gap-2">
        {!isInterviewing ? (
          <Button onClick={startInterview} className="flex-1">
            Start Interview
          </Button>
        ) : (
          <Button onClick={pauseInterview} className="flex-1">
            Pause Interview
          </Button>
        )}
        {isInterviewing && (
          <Button onClick={resumeInterview} className="flex-1">
            Resume Interview
          </Button>
        )}
        <Button onClick={endInterview} variant="destructive" className="flex-1">
          End Interview
        </Button>
      </div>
    </div>
  );
};

export default AIInterviewerControls; 