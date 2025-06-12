import React from "react";
import { Card, Tag as AntTag, Typography, Space } from "antd";
import { Tag } from "@/services/Tags/typing";
import { Link } from "umi";

const { Text } = Typography;

const TagCard: React.FC<{ tag: Tag }> = ({ tag }) => {
  return (
    <Link to={`/questions/tagged/${tag.name}`}>
      <Card
        hoverable
        className="flex flex-col justify-between bg-[var(--bg-primary)] hover:shadow-lg border theme-border border-[var(--border-color)] rounded-lg h-[200px] transition-all duration-300"
        bodyStyle={{
          padding: 0, // Remove AntD padding, use Tailwind instead
        }}
      >
        <Space direction="vertical" className="flex flex-col justify-between p-4 w-full h-full">
          {/* Tag name */}
          <AntTag color="blue" className="px-2 py-1 rounded-lg w-fit text-sm">
            {tag.name}
          </AntTag>

          {/* Description with overflow handling - max 3 lines */}
          <div className="flex-1 h-[4.1em] overflow-hidden line-clamp-3">
            <span
              className="block overflow-hidden text-[14px] text-[var(--text-primary)] text-ellipsis line-clamp-3 leading-[1.4]"
              title={tag.description}
            >
              {tag.description}
            </span>
          </div>

          {/* Statistics */}
          <div className="mt-auto">
            <span className="block mb-1 font-bold text-[14px] text-[var(--text-primary)]">
              {tag.count ?? 0} questions
            </span>

            {(tag.count ?? 0) > 0 && (
              <span className="text-[var(--text-secondary)] text-xs leading-[1.3]">
                ({tag.count} asked today, {tag.count} this week)
              </span>
            )}
          </div>
        </Space>
      </Card>
    </Link>
  );
};

export default TagCard;
