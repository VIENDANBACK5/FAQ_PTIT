import { useState, useCallback } from 'react';
import { message } from 'antd';
import { Question } from '@/services/Questions/typing';
import { Answer } from '@/services/Answers/typing';
import { Tag } from '@/services/Tags/typing';
import { User } from '@/services/Users/typing';
import { getUserQuestions, getUserAnswers, getUserTags } from '@/services/Users';

interface ProfileState {
  questions: Question[];
  answers: Answer[];
  tags: Tag[];
  loading: {
    questions: boolean;
    answers: boolean;
    tags: boolean;
  };
}

export default () => {
  const [profileState, setProfileState] = useState<ProfileState>({
    questions: [],
    answers: [],
    tags: [],
    loading: {
      questions: false,
      answers: false,
      tags: false,
    },
  });

  // Fetch user's questions
  const fetchUserQuestions = useCallback(async (userId: number) => {
    if (!userId) return;

    setProfileState(prev => ({
      ...prev,
      loading: { ...prev.loading, questions: true },
    }));

    try {
      const result = await getUserQuestions(userId);
      if (result.success && result.data) {
        setProfileState(prev => ({
          ...prev,
          questions: result.data ?? [],
          loading: { ...prev.loading, questions: false },
        }));
      } else {
        setProfileState(prev => ({
          ...prev,
          questions: [],
          loading: { ...prev.loading, questions: false },
        }));
        if (result && !result.success) {
          message.warning(result.message || 'Không thể tải danh sách câu hỏi');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user questions:', error);
      setProfileState(prev => ({
        ...prev,
        questions: [],
        loading: { ...prev.loading, questions: false },
      }));
      message.error(error?.data?.message || 'Không thể tải danh sách câu hỏi');
    }
  }, []);

  // Fetch user's answers
  const fetchUserAnswers = useCallback(async (userId: number) => {
    if (!userId) return;

    setProfileState(prev => ({
      ...prev,
      loading: { ...prev.loading, answers: true },
    }));

    try {
      const result = await getUserAnswers(userId);
      if (result.success && result.data) {
        setProfileState(prev => ({
          ...prev,
          answers: result.data ?? [],
          loading: { ...prev.loading, answers: false },
        }));
      } else {
        setProfileState(prev => ({
          ...prev,
          answers: [],
          loading: { ...prev.loading, answers: false },
        }));
        if (result && !result.success) {
          message.warning(result.message || 'Không thể tải danh sách câu trả lời');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user answers:', error);
      setProfileState(prev => ({
        ...prev,
        answers: [],
        loading: { ...prev.loading, answers: false },
      }));
      message.error(error?.data?.message || 'Không thể tải danh sách câu trả lời');
    }
  }, []);

  // Fetch user's tags
  const fetchUserTags = useCallback(async (userId: number) => {
    if (!userId) return;

    setProfileState(prev => ({
      ...prev,
      loading: { ...prev.loading, tags: true },
    }));

    try {
      const result = await getUserTags(userId);
      if (result.success && result.data) {
        setProfileState(prev => ({
          ...prev,
          tags: result.data ?? [],
          loading: { ...prev.loading, tags: false },
        }));
      } else {
        setProfileState(prev => ({
          ...prev,
          tags: [],
          loading: { ...prev.loading, tags: false },
        }));
        if (result && !result.success) {
          message.warning(result.message || 'Không thể tải danh sách thẻ');
        }
      }
    } catch (error: any) {
      console.error('Error fetching user tags:', error);
      setProfileState(prev => ({
        ...prev,
        tags: [],
        loading: { ...prev.loading, tags: false },
      }));
      message.error(error?.data?.message || 'Không thể tải danh sách thẻ');
    }
  }, []);

  // Fetch all user data at once
  const fetchUserData = useCallback(async (userId: number) => {
    if (!userId) return;
    
    await Promise.all([
      fetchUserQuestions(userId),
      fetchUserAnswers(userId),
      fetchUserTags(userId),
    ]);
  }, [fetchUserQuestions, fetchUserAnswers, fetchUserTags]);

  return {
    ...profileState,
    fetchUserQuestions,
    fetchUserAnswers,
    fetchUserTags,
    fetchUserData,
  };
};