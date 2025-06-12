import { User } from "@/services/Users/typing";

export const users: User[] = [
  {
    id: 1,
    username: "sinh vien 1",
    email: "sv1@ptit.edu.vn",
    password: "123456",
    created_at: "5/5/2025",
    reputation: 123,
    avatar: "https://placehold.co/150?text=S",
    title: "Sinh viên 1",
    bio: "Đam mê công nghệ thông tin và học hỏi không ngừng.",
    role: "student",
    is_activate: true,
  },
  {
    id: 2,
    username: "giang vien 1",
    email: "gv1@ptit.edu.vn",
    password: "123456",
    created_at: "03/03/2025",
    reputation: 500,
    avatar: "https://placehold.co/150",
    title: "Giảng viên 1",
    bio: "Chuyên gia trong lĩnh vực khoa học máy tính, giảng dạy tại PTIT.",
    role: "teacher",
    is_activate: true,
  },
  {
    id: 3,
    username: "admin",
    email: "admin@ptit.edu.vn",
    password: "admin123",
    created_at: "01/01/2025",
    reputation: 1000,
    avatar: "https://placehold.co/150",
    role: "admin",
    is_activate: true,
  },
  {
    id: 4,
    username: "sinh vien 2",
    email: "sv2@ptit.edu.vn",
    password: "123456",
    created_at: "10/5/2025",
    reputation: 75,
    avatar: "https://placehold.co/150?text=S2",
    title: "Sinh viên 2",
    bio: "Yêu thích lập trình web và machine learning.",
    role: "student",
    is_activate: true,
  },
  {
    id: 5,
    username: "malong",
    email: "malongtttttt@ptit.edu.vn",
    password: "123456",
    created_at: "11/6/2025",
    reputation: 0,
    avatar: "https://placehold.co/150?text=m",
    title: "",
    bio: "",
    role: "student",
    is_activate: true,
  },
];

export default {
  // Lấy người dùng theo ID
  "GET /api/users/:id": (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find((u) => u.id === id);
    if (user) {
      const { password: _, ...safeUser } = user;
      res.send({ success: true, data: safeUser });
    } else {
      res.status(404).send({ success: false, message: "Không tìm thấy người dùng" });
    }
  },

  // Khoá tài khoản người dùng
  "POST /api/users/:id/lock": (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.is_activate = false;
      res.send({ success: true, data: { ...user, password: undefined } });
    } else {
      res.status(404).send({ success: false, message: "Không tìm thấy người dùng" });
    }
  },

  // Mở khoá tài khoản người dùng
  "POST /api/users/:id/unlock": (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const user = users.find((u) => u.id === id);
    if (user) {
      user.is_activate = true;
      res.send({ success: true, data: { ...user, password: undefined } });
    } else {
      res.status(404).send({ success: false, message: "Không tìm thấy người dùng" });
    }
  },


  // Xoá nhiều người dùng cùng lúc
  "DELETE /api/users": (req: any, res: any) => {
    const ids: number[] = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Danh sách ID không hợp lệ hoặc trống.",
      });
    }

    let deletedCount = 0;
    ids.forEach((id) => {
      const index = users.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        deletedCount++;
      }
    });

    res.send({
      success: true,
      message: `Đã xoá ${deletedCount} người dùng.`,
    });
  },

  // Đăng nhập
  "POST /api/login": (req: any, res: any) => {
    const { email, password } = req.body;
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      if (user.is_activate === false) {
        return res.status(403).send({ success: false, message: "Tài khoản đã bị khoá" });
      }
      const { password: _, ...safeUser } = user;
      res.send({
        success: true,
        data: {
          token: "mock-token-" + user.id,
          user: safeUser
        },
      });
    } else {
      res
        .status(401)
        .send({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }
  },

  // Tăng kinh nghiệm cho user
  "POST /api/users/:id/increase-reputation": (req: any, res: any) => {
    const id = parseInt(req.params.id, 10);
    const { amount } = req.body;
    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).send({ success: false, message: "Không tìm thấy người dùng" });
    }
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return res.status(400).send({ success: false, message: "Số kinh nghiệm tăng không hợp lệ" });
    }
    user.reputation += amount;
    res.send({ success: true, data: { ...user, password: undefined } });
  },
};
