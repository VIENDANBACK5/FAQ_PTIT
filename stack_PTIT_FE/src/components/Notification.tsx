import React , { useState } from 'react'
import { Badge, Button, Divider, List, Popover, Tabs, Tooltip, Empty } from 'antd'
import { BellOutlined } from '@ant-design/icons'

interface NotificationProps {
    numberOfNotifications?: number
    bellColor?: string
}

const Notification: React.FC<NotificationProps> = ({ numberOfNotifications = 0, bellColor }) => {
    const [open, setOpen] = useState(false);
    
      const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
      };
    return (
    <>
      <Tooltip title="Thông báo">
        <Popover
          content={
        <>
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
          {
            key: "1",
            label: `Thông báo (${numberOfNotifications})`,
            children: numberOfNotifications > 0 ? (
              <List className="pb-8 max-h-[400px] overflow-y-auto">
            {Array.from(
              { length: numberOfNotifications },
              (_, index) => (
                <List.Item
              key={index}
              className="hover:bg-[#f5f5f5] hover:cursor-pointer"
                >
              <List.Item.Meta
                title={<p>Thông báo {index + 1}</p>}
                description="Nội dung thông báo"
                className="px-3"
              />
              <p className="text-gray-400">31/08/2005</p>
                </List.Item>
              )
            )}
              </List>
            ) : (
              <Empty description="Không có thông báo" className='pb-12'/>
            ),
          },
            ]}
            className="w-[400px]"
          />
          <div className="right-0 bottom-0 left-0 absolute flex justify-center bg-white p-2 border-t">
            <div className="text-center basis-1/2">Đánh dấu đã đọc</div>
            <Divider type="vertical" />
            <div className="text-center basis-1/2">Tải thêm</div>
          </div>
        </>
          }
          onOpenChange={handleOpenChange}
          trigger="click"
          placement="bottomRight"
          className="relative"
        >
          <Badge count={numberOfNotifications} size="small" offset={[0, 0]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20, color: bellColor }} />}
          style={{ color: "#fff" }}
        />
          </Badge>
        </Popover>
      </Tooltip>
    </>
  );
}

export default Notification
