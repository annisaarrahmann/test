import { useState } from "react";
import {
  Flex,
  Typography,
  Table,
  Tag,
  Button,
  notification,
  Space,
  Modal,
  Form,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAllPendingMails, getURL, updateMail } from "../../lib/pocketbase";

interface DataType {
  mailNo: string;
  summary: string;
  date: string;
  otherMail: string;
  status: string;
  approver: string;
  mail_file: string;
}

type FieldType = {
  rejected_comment?: string;
};

const columns: (onAction: any) => ColumnsType<DataType> = (onAction) => [
  {
    title: "No Surat",
    dataIndex: "mailNo",
    key: "mailNo",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Perihal",
    dataIndex: "summary",
    key: "summary",
  },
  {
    title: "Tanggal Surat",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Tujuan",
    dataIndex: "reciever",
    key: "reciever",
  },
  {
    title: "Dasar Surat",
    dataIndex: "baseMail",
    key: "baseMail",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => {
      switch (status) {
        case "pending":
          return <Tag color="processing">{status.toUpperCase()}</Tag>;
        case "success":
          return <Tag color="success">{status.toUpperCase()}</Tag>;
        case "failed":
          return <Tag color="error">{status.toUpperCase()}</Tag>;
        default:
          return <Tag color="success">{status.toUpperCase()}</Tag>;
      }
    },
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) =>
      record.status === "pending" ? (
        <Space>
          <Button onClick={() => onAction(record, "approve")}>Setujui</Button>
          <Button onClick={() => onAction(record, "reject")}>Tolak</Button>
          <Button>
            <Typography.Link href={getURL(record, record.mail_file)}>
              Unduh
            </Typography.Link>
          </Button>
        </Space>
      ) : null,
  },
];

const MailApproval = () => {
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>({});

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { isLoading, data } = useQuery({
    queryKey: ["pendingmails"],
    queryFn: getAllPendingMails,
  });

  const { mutateAsync, isLoading: isLoadingAction } = useMutation({
    mutationFn: updateMail,
  });

  const onAction = async (values: any, action: string) => {
    if (action === "reject") {
      setIsModalOpen(true);
      setModalData(values);
      return;
    }

    try {
      const formData = {
        id: values.id,
        status: action,
      };
      await mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["pendingmails"] });
    } catch (error) {
      api.open({
        message: "Gagal",
        description: "Aksi gagal dilakukan",
      });
    }
  };

  const onFinish = async (value: any) => {
    try {
      const formData = {
        id: modalData.id,
        status: "reject",
        rejected_comment: value.rejected_comment,
      };
      await mutateAsync(formData);
      queryClient.invalidateQueries({ queryKey: ["pendingmails"] });
    } catch (error) {
      api.open({
        message: "Gagal",
        description: "Aksi gagal dilakukan",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <Flex vertical>
      {contextHolder}

      <Modal
        title="Tolak"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Alasan Menolak"
            name="rejected_comment"
            rules={[{ required: true, message: "Tolong masukkan alasan menolak" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button loading={isLoadingAction} type="primary" htmlType="submit">
              Tolak Surat
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Flex gap="small" justify="space-between">
        <Typography.Title level={2}>Persetujuan Surat</Typography.Title>
      </Flex>
      <Table
        loading={isLoading || isLoadingAction}
        columns={columns(onAction)}
        dataSource={
          data?.items.map((item) => ({
            ...item,
            key: item.id,
            approver: item.expand?.approver?.name,
          })) as any
        }
      />
    </Flex>
  );
};

export default MailApproval;
