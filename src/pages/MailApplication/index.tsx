import {
  Flex,
  Typography,
  Table,
  Tag,
  Input,
  Button,
  Modal,
  Form,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createMail,
  getAllMails,
  userData,
} from "../../lib/pocketbase";

interface DataType {
  mailNo: string;
  summary: string;
  date: string;
  otherMail: string;
  status: string;
  approver: string;
}

type FieldType = {
  mailNo?: string;
  summary?: string;
  date?: any;
  baseMail?: string;
  approver?: string;
};

const columns: ColumnsType<DataType> = [
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
    title: "Tujuan",
    dataIndex: "approver",
    key: "approver",
  },
];

const MailApplication = () => {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["mails"],
    queryFn: getAllMails,
  });

  const { mutateAsync } = useMutation({
    mutationFn: createMail,
  });

  const onFinish = async (values: FieldType) => {
    const formData = {
      mailNo: values.mailNo,
      summary: values.summary,
      date: values.date.format(),
      approver: userData?.supervisor,
      status: "pending",
      creator: userData?.id,
      baseMail: values.baseMail,
    };

    console.log(userData, formData);
    mutateAsync(formData);
  };

  return (
    <Flex vertical>
      <Modal
        title="Tambah Surat"
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="No Surat"
            name="mailNo"
            rules={[{ required: true, message: "Tolong masukkan nomor surat" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Tanggal Surat"
            name="date"
            rules={[
              { required: true, message: "Tolong masukkan tanggal surat" },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item<FieldType>
            label="Dasar Surat"
            name="baseMail"
            rules={[{ required: true, message: "Tolong masukkan nomor surat" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Perihal"
            name="summary"
            rules={[{ required: true, message: "Tolong masukkan perihal" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Tambah Surat
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Flex gap="small" justify="space-between">
        <Typography.Title level={2}>Pengajuan Surat</Typography.Title>
        <Button onClick={() => setOpen(true)}>
          <PlusOutlined />
          Tambah Transaksi Surat
        </Button>
      </Flex>
      <Table
        columns={columns}
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

export default MailApplication;
