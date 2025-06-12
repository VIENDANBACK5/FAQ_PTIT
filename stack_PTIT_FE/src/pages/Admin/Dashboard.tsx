import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { UserOutlined, FileTextOutlined, CommentOutlined, EyeOutlined, ArrowLeftOutlined, ExpandOutlined, ExpandAltOutlined } from '@ant-design/icons';
import { Bar } from '@ant-design/plots';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { API_URL } from '@/config';
import request from 'umi-request';
import { getUsers } from '@/services/Users';
import { getQuestions } from '@/services/Questions';
import { getComments } from '@/services/Comments';
import { User } from '@/services/Users/typing';
import { Question } from '@/services/Questions/typing';
import { Comment } from '@/services/Comments/typing';

const AdminDashboard: React.FC = () => {
  // Lấy dữ liệu từ BE thông qua API
  const user  = useModel('user');
  const [activeTab, setActiveTab] = useState('posts');
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Lấy users từ API
    getUsers().then(res => setUsers(res.data || []));
    // Lấy questions từ API
    getQuestions({ page: 1, pageSize: 100 }).then(res => setQuestions(res.data?.list || []));
    // Lấy comments từ API
    getComments().then(res => setComments(res.data || []));
  }, []);

  // Lấy 5 ngày gần nhất (dạng dd/MM/yyyy, luôn đủ 2 số)
  const labels = Array.from({ length: 5 }, (_, i) => dayjs().subtract(4 - i, 'day').format('DD/MM/YYYY'));

  // Thống kê bài viết được đăng mỗi ngày (theo created_at)
  const postChartData = labels.map(date => ({
    date,
    value: Number(questions.filter(q => q.created_at && dayjs(q.created_at).format('DD/MM/YYYY') === date).length),
  }));

  const chartConfig = {
    data: postChartData,
    xField: 'date',
    yField: 'value',
    color: ['#4CAF50'],
    label: {
      position: 'top',
      style: {
        fill: '#222',
        fontWeight: 600,
        fontSize: 15,
        textShadow: '0 1px 2px #fff',
      },
      offset: 8,
    },
    xAxis: {
      title: { text: 'Ngày', style: { fontWeight: 700, fontSize: 16 } },
      label: {
        style: {
          fontWeight: 600,
          fontSize: 15,
        },
        autoRotate: true,
        rotate: Math.PI / 6, // Xoay nhãn 30 độ để không bị cắt chữ
        autoHide: false,
        autoEllipsis: false,
      },
      line: { style: { stroke: '#bdbdbd', lineWidth: 2 } },
      grid: { line: { style: { stroke: '#e0e0e0', lineDash: [4, 4] } } },
    },
    tooltip: {
      showMarkers: true,
      shared: true,
      customContent: (title: string, items: any[]) => {
        if (!items || items.length === 0) return null;
        return `<div style='padding:8px 12px;min-width:120px;'>
          <div style='font-weight:700;font-size:15px;margin-bottom:6px;'>${title}</div>
          ${items.map(item => {
            let v = Number(item.value);
            if (isNaN(v) || v == null) v = 0;
            return `<div style='margin-bottom:2px;'><span style='display:inline-block;width:12px;height:12px;background:${item.color};border-radius:2px;margin-right:6px;'></span>${item.name ? item.name : ''}: <b>${v}</b></div>`;
          }).join('')}
        </div>`;
      },
      domStyles: {
        'g2-tooltip': {
          borderRadius: '10px',
          boxShadow: '0 2px 12px #b3c6ff55',
          fontSize: '15px',
          padding: '12px 16px',
        },
      },
    },
    height: 420,
    columnStyle: { radius: [8, 8, 0, 0], fill: '#fff', stroke: '#e0e0e0', lineWidth: 1 },
    padding: [40, 40, 60, 60],
    animation: { appear: { animation: 'scale-in-x', duration: 800 } },
  };

  // Lấy dữ liệu mock
  const totalUsers = users.length;
  const totalQuestions = questions.length;
  const totalComments = comments.length;
  // Tính tổng số lượt xem từ tất cả questions
  const totalViews = questions.reduce((sum: number, q: any) => sum + (q.views || 0), 0);

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button className="hover:bg-gray-200 p-2 rounded-lg transition-colors">
            <ArrowLeftOutlined className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-gray-800 text-xl">Bảng Điều Khiển Quản Trị</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="hover:bg-gray-200 p-2 rounded-lg transition-colors">
            <ExpandAltOutlined className="w-4 h-4 text-gray-600" />
          </Button>
          <Button className="hover:bg-gray-200 p-2 rounded-lg transition-colors">
            <ExpandOutlined className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-12">
        {/* Hàng đầu tiên - Thống kê chính */}
        <div className="col-span-3">
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <Statistic
              title="Tổng số người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <Statistic
              title="Tổng số bài viết"
              value={totalQuestions}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <Statistic
              title="Tổng số bình luận"
              value={totalComments}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </div>
        </div>

        <div className="col-span-3">
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <Statistic
              title="Tổng số lượt xem"
              value={totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </div>
        </div>

        {/* Hàng thứ hai - Nút chuyển đổi và biểu đồ */}
        <div className="col-span-12">
          <div className="bg-white shadow-sm p-6 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800 text-lg">
                Thống kê số câu hỏi được hỏi trong 5 ngày gần nhất
              </h3>
            </div>
            <Bar {...chartConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
