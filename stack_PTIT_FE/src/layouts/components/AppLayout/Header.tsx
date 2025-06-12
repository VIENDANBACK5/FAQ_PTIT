import React, { useEffect, useState } from "react";
import { Link, history } from "umi";
import {
  Layout,
  Menu,
  Input,
  Button,
  Avatar,
  Dropdown,
  Popover,
  Divider,
  List,
  Typography,
  Tag,
  AutoComplete,
} from "antd";
import { LogoutOutlined, SearchOutlined, TagOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { useModel } from "umi";
import type { MenuProps } from "antd";
import Notification from "@/components/Notification";
import { getSearchSuggestions } from "@/services/Search";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const { Header } = Layout;
const { Search } = Input;

const { Text } = Typography;

const HeaderBasicLauyout: React.FC = () => {
  const { user, handleLogout, loadUserFromStorage } = useModel("user");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
      onClick: () => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const formattedName = userData.username ? userData.username.replace(/\s+/g, "-") : "";
        history.push(`/users/${userData.id}/${formattedName}`);
      },
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,

      label: <p className="text-red-500">Đăng xuất</p>,
      onClick: handleLogout,
    },
  ];

  // Fetch suggestions when search value changes
  const fetchSuggestions = async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await getSearchSuggestions(keyword);
      if (response.success) {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Search templates for quick access
  const searchTemplates = [
    {
      category: "Tìm kiếm cơ bản",
      items: [
        { text: "React hooks", description: "Tìm câu hỏi về React hooks" },
        { text: "JavaScript performance", description: "Tìm về hiệu suất JavaScript" },
        { text: "CSS flexbox", description: "Tìm về CSS flexbox" },
      ],
    },
    {
      category: "Tìm theo tags",
      items: [
        { text: "[javascript]", description: "Chỉ câu hỏi có tag JavaScript" },
        { text: "[react] [hooks]", description: "Câu hỏi có cả tag React và hooks" },
        { text: "[css] responsive", description: "Tag CSS + từ khóa responsive" },
      ],
    },
    {
      category: "Tìm kiếm chính xác",
      items: [
        { text: '"REST API"', description: "Tìm chính xác cụm từ" },
        { text: '"async await"', description: "Tìm về async/await" },
        { text: '"best practices"', description: "Tìm về best practices" },
      ],
    },
    {
      category: "Lọc theo số lượng",
      items: [
        { text: "votes>=5", description: "Câu hỏi có từ 5 votes trở lên" },
        { text: "answers>=2", description: "Câu hỏi có từ 2 câu trả lời" },
        { text: "answers=0", description: "Câu hỏi chưa có câu trả lời" },
      ],
    },
    {
      category: "Tìm kiếm nâng cao",
      items: [
        { text: '[react] "optimization" votes>=3', description: "Kết hợp tag, cụm từ và votes" },
        { text: "[javascript] performance answers>=1", description: "Tag JS + performance + có answers" },
        { text: '"API design" comments>=1', description: "API design + có comments" },
      ],
    },
    {
      category: "Tìm kiếm theo người dùng",
      items: [
        { text: "user:1", description: "Tìm tất cả câu hỏi của user có ID 1" },
        { text: "user:2 react", description: "Câu hỏi của user ID 2 về React" },
        { text: "user:3 [javascript]", description: "Câu hỏi của user ID 3 có tag JavaScript" },
      ],
    },
  ];

  const handleTemplateClick = (template: string) => {
    setSearchValue(template);
    // Keep popover open so user can see the template filled
  };

  // Search hint content with suggestions and templates
  const searchHintContent = (
    <div className="bg-[var(--bg-primary)] shadow-lg p-4 w-[800px] max-h-[600px] overflow-y-auto">
      <div className="mb-4">
        <h3 className="mb-2 font-bold">🔍 Mẫu tìm kiếm - Click để thử</h3>

        {searchTemplates.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-4">
            <h4 className="mb-2 font-semibold text-blue-600">
              {category.category}
            </h4>
            <div className="gap-1 grid grid-cols-1">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-between items-center bg-[var(--bg-primary)] hover:bg-blue-50 p-2 rounded transition-colors cursor-pointer"
                  onClick={() => handleTemplateClick(item.text)}
                >
                  <div className="flex-1">
                    <code className="bg-[var(--bg-primary)] mr-3 px-2 py-1 rounded font-medium text-blue-600">
                      {item.text}
                    </code>
                    <span className="text-gray-600 text-sm">
                      {item.description}
                    </span>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    className="text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch(item.text);
                    }}
                  >
                    Tìm →
                  </Button>
                </div>
              ))}
            </div>
            {categoryIndex < searchTemplates.length - 1 && (
              <Divider className="my-3" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-primary)] mb-4 p-3 rounded-lg">
        <h4 className="mb-2 font-semibold">💡 Cú pháp tìm kiếm nâng cao</h4>
        <div className="space-y-1 text-sm">
          <div>
            <code className="bg-[var(--bg-primary)] px-1">[tag]</code> - Tìm
            theo tag
          </div>
          <div>
            <code className="bg-[var(--bg-primary)] px-1">"phrase"</code> - Tìm
            chính xác cụm từ
          </div>
          <div>
            <code className="bg-[var(--bg-primary)] px-1">votes{">"}=n</code> -
            Lọc theo votes ({">"}=, {"<"}=, {">"}, {"<"}, =)
          </div>
          <div>
            <code className="bg-[var(--bg-primary)] px-1">answers{">"}=n</code>{" "}
            - Lọc theo số câu trả lời
          </div>
          <div>
            <code className="bg-[var(--bg-primary)] px-1">comments{">"}=n</code>{" "}
            - Lọc theo số comments
          </div>
          <div>
            <code className="bg-[var(--bg-primary)] px-1">user:id</code> - Tìm
            câu hỏi của người dùng có ID cụ thể
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div>
          <Divider className="my-3" />
          <h4 className="mb-2 font-semibold">📋 Gợi ý từ hệ thống</h4>
          <List
            size="small"
            dataSource={suggestions}
            renderItem={(item: any) => (
              <List.Item
                className="hover:bg-gray-50 px-2 py-1 rounded cursor-pointer"
                onClick={() => handleSearch(item.text)}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    {item.type === "tag" ? (
                      <TagOutlined className="mr-2 text-blue-500" />
                    ) : item.type === "user" ? (
                      <UserOutlined className="mr-2 text-purple-500" />
                    ) : (
                      <QuestionCircleOutlined className="mr-2 text-green-500" />
                    )}
                    <Text>{item.text}</Text>
                    {item.description && (
                      <Text type="secondary" className="ml-2">
                        - {item.description}
                      </Text>
                    )}
                  </div>
                  <Tag
                    color={
                      item.type === "tag"
                        ? "blue"
                        : item.type === "user"
                          ? "purple"
                          : "green"
                    }
                  >
                    {item.count}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}

      {searchValue && suggestions.length === 0 && !loadingSuggestions && (
        <div>
          <Divider className="my-3" />
          <Text type="secondary">
            Không có gợi ý từ hệ thống cho "{searchValue}"
          </Text>
        </div>
      )}
    </div>
  );

  const handleSearch = (value: string) => {
    setSearchVisible(false);
    setSearchValue("");
    setSuggestions([]);
    history.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    fetchSuggestions(value);
  };

  return (
    <Header className="z-10 fixed flex justify-between items-center bg-[#001529] shadow-lg w-full">
      <Link
        to="/"
        style={{ display: "flex", alignItems: "center", width: "150px" }}
        className="flex items-center bg-[#001529] w-[150px]"
      >
        <h1 className="font-bold text-white text-3xl">stack PTIT</h1>
      </Link>

      <div className="flex flex-1 justify-end items-center">
        <Popover
          content={searchHintContent}
          trigger="click"
          open={searchVisible}
          onOpenChange={setSearchVisible}
          placement="bottom"
          overlayClassName="search-hint-popover"
        >
          <Input.Search
            placeholder="Tìm kiếm câu hỏi, từ khóa..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            style={{ width: "50%", marginLeft: "16px" }}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearch}
            onFocus={() => setSearchVisible(true)}
            loading={loadingSuggestions}
          />
        </Popover>

        <div>
          {user ? (
            <div className="flex items-center ml-4">
              <ThemeSwitcher />
              <Notification numberOfNotifications={0} />
              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <div className="flex items-center ml-4 cursor-pointer">
                  <Avatar
                    icon={<UserOutlined />}
                    src={user.avatar}
                    className="bg-[#1677ff] mr-2 text-white"
                  />
                  <span className="text-white">{user.username}</span>
                </div>
              </Dropdown>
            </div>
          ) : (
            <>
              <Button
                type="primary"
                style={{ marginLeft: "8px" }}
                onClick={() => history.push("/auth/login")}
              >
                Đăng nhập
              </Button>
              <Button
                type="default"
                style={{ marginLeft: "8px" }}
                onClick={() => history.push("/auth/register")}
              >
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default HeaderBasicLauyout;
