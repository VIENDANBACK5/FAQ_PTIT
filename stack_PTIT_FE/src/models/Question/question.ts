import { useEffect, useState } from "react";
import { getQuestions } from "@/services/Questions";
import { Question } from "@/services/Questions/typing";

export default () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState("newest");
    const [filter, setFilter] = useState("all");

    const fetchQuestions = async () => {
        setLoading(true);
        try {
          const response = await getQuestions({
            page,
            pageSize,
            sort,
            filter,
          });
          
          let questions: Question[] = [];
          let total = 0;
          if (Array.isArray(response)) {
            questions = response;
            total = response.length;
          } else if (response && Array.isArray(response.questions)) {
            questions = response.questions;
            total = response.total || response.questions.length || 0;
          } else {
            questions = [];
            total = 0;
          }
          setQuestions(questions);
          setTotal(total);
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchQuestions();
      }, [page, pageSize, sort, filter]);
      
      const handleSortChange = (value: string) => {
        setSort(value);
        setPage(1); // Reset về trang đầu khi thay đổi điều kiện
      };
      
      const handleFilterChange = (value: string) => {
        setFilter(value);
        setPage(1); // Reset về trang đầu khi thay đổi điều kiện
      };
      
      const handlePageChange = (newPage: number, newPageSize?: number) => {
        setPage(newPage);
        if (newPageSize) {
          setPageSize(newPageSize);
        }
      };
    
    return {
        questions,
        loading,
        total,
        page,
        pageSize,
        sort,
        filter,
        handleSortChange,
        handleFilterChange,
        handlePageChange,
    };
}