import "./styles/global.scss";

import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileDoneOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  theme,
  App,
  Dropdown,
  MenuProps,
  Flex,
  Avatar,
  Typography,
} from "antd";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/protectedPage";

import { signout, userData } from "./lib/pocketbase";
import MailApplication from "./pages/MailApplication";
import MailApproval from "./pages/MailApproval";

const queryClient = new QueryClient();

const { Header, Sider, Content, Footer } = Layout;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <p>Logout</p>,
    onClick: () => {
      signout();
      window.location.reload();
    },
  },
];

function MainApp() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const GeneralLayout = () => {
    return (
      <ProtectedRoute>
        <App>
          <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
              <div className="main-logo">
                <img src="/logo.svg" alt="" />
                {!collapsed ? <span>App Surat</span> : null}
              </div>
              <Menu
                theme="dark"
                mode="inline"
                items={[
                  {
                    key: "1",
                    icon: <HomeOutlined />,
                    label: <Link to="/">Beranda</Link>,
                  },
                  {
                    key: "2",
                    icon: <FileTextOutlined />,
                    label: <Link to="/mail/application">Pengajuan Surat</Link>,
                  },
                  {
                    key: "3",
                    icon: <FileDoneOutlined />,
                    label: <Link to="/mail/approval">Persetujuan Surat</Link>,
                  },
                ]}
              />
            </Sider>

            <Layout>
              <Header
                style={{ padding: "0 20px", background: colorBgContainer }}
              >
                <Flex gap="middle" justify="space-between" align="center">
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 64,
                      height: 64,
                    }}
                  />

                  <Dropdown menu={{ items }} placement="bottomLeft">
                    <Flex gap="small" align="center">
                      <Avatar icon={<UserOutlined />} />
                      <Typography.Text>{userData?.name}</Typography.Text>
                    </Flex>
                  </Dropdown>
                </Flex>
              </Header>
              <Content
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  minHeight: "calc(100vh - 110px)",
                  background: colorBgContainer,
                }}
              >
                <Outlet />
              </Content>
              <Footer style={{ textAlign: "center" }}>
                Departemen Pengadaan ©2023 Created by Annisa Aulia Rahman
              </Footer>
            </Layout>
          </Layout>
        </App>
      </ProtectedRoute>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <GeneralLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/mail/application",
          element: <MailApplication />,
        },
        {
          path: "/mail/approval",
          element: <MailApproval />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default MainApp;
