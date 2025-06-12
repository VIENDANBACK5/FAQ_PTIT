import { Layout} from "antd";
import { Link, Outlet } from "umi";

const { Header, Content } = Layout;

export default function AuthLayout(): JSX.Element {
    return (
        <Layout className="bg-gray-50 min-h-screen">
              <Header className="flex items-center bg-white shadow-sm">
                <Link to="/" className="flex items-center">
                  <h1 className="font-bold text-blue-700 text-3xl">stack PTIT</h1>
                </Link>
              </Header>
              <Content className="flex justify-center items-center p-6">
                <Outlet />
            </Content>
        </Layout>
    );
}