import { useState } from "react";
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
  notification,
  Select,
  Upload,
  Space,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMail,
  getAllMails,
  getURL,
  updateMail,
  userData,
} from "../../lib/pocketbase";
import dayjs from "dayjs";

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
  id?: string;
  mailNo?: string;
  summary?: string;
  date?: any;
  baseMail?: string;
  approver?: string;
  reciever?: string;
  mail_file: { file: File };
};

const columns: (onModalOpen: (data: any) => void) => ColumnsType<DataType> = (
  onModalOpen
) => [
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
    width: 120,
    render: (val) => dayjs(val).format("DD-MM-YYYY"),
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
    title: "Alasan Ditolak",
    dataIndex: "rejected_comment",
    key: "rejected_comment",
    render: (val) => (val ? val : "-"),
  },
  {
    title: "Persetujuan",
    dataIndex: "approver",
    key: "approver",
  },
  {
    title: "Tujuan",
    dataIndex: "reciever",
    key: "reciever",
  },

  {
    title: "Action",
    render: (_, record) => (
      <Space>
        <Typography.Link href={getURL(record, record.mail_file)}>
          <Button>Unduh</Button>
        </Typography.Link>
        {record.status !== "approve" ? (
          <Button onClick={() => onModalOpen(record)}>Edit</Button>
        ) : null}
      </Space>
    ),
  },
];

const MailApplication = () => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(undefined);

  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { isLoading, data } = useQuery({
    queryKey: ["mails"],
    queryFn: getAllMails,
  });

  const { mutateAsync, isLoading: isLoadingCreate } = useMutation({
    mutationFn: createMail,
  });

  const { mutateAsync: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(
    {
      mutationFn: updateMail,
    }
  );

  const onFinish = async (values: FieldType) => {
    try {
      const formData = new FormData();

      formData.append("status", "pending");

      if (values.mailNo) {
        formData.append("mailNo", values.mailNo);
      }

      if (values.summary) {
        formData.append("summary", values.summary);
      }

      if (values.date) {
        formData.append("date", values.date.format());
      }

      if (userData?.supervisor) {
        formData.append("approver", userData?.supervisor);
      }

      if (userData?.id) {
        formData.append("creator", userData?.id);
      }

      if (values.baseMail) {
        formData.append("baseMail", values.baseMail);
      }

      if (values.mail_file) {
        formData.append("mail_file", values.mail_file.file);
      }

      if (values.reciever) {
        formData.append("reciever", values.reciever);
      }

      if (modalData) {
        await mutateUpdate({ id: modalData.id, ...values, status: "pending" });
      } else {
        await mutateAsync(formData);
      }
      setModalData(null);
      queryClient.invalidateQueries({ queryKey: ["mails"] });

      setOpen(false);
    } catch (error) {
      api.error({
        message: "Gagal",
        description: "Kamu gagal menambahkan surat",
      });
    }
  };

  const onEdit = (data: any) => {
    setOpen(true);
    setModalData(data);
    form.setFieldsValue({ ...data, date: dayjs(data.date) });
  };

  return (
    <Flex vertical>
      {contextHolder}

      <Modal
        title={modalData ? "Ubah Surat" : "Tambah Surat"}
        centered
        open={open}
        onCancel={() => {
          setModalData(undefined);
          form.resetFields();
          setOpen(false);
        }}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{ remember: true }}
          form={form}
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
            label="Tujuan"
            name="reciever"
            rules={[
              { required: true, message: "Tolong masukkan tujuan surat" },
            ]}
          >
            <Select
              options={[
                { value: "Akuntansi", label: "Akuntansi" },
                { value: "Pemasaran", label: "Pemasaran" },
                { value: "SDM", label: "SDM" },
                { value: "Enjinering", label: "Enjinering" },
                { value: "Bisreg", label: "Bisreg" },
                { value: "Perencanaan", label: "Perencanaan" },
              ]}
            />
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

          <Form.Item label="Upload" name="mail_file">
            <Upload maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              loading={isLoadingCreate || isLoadingUpdate}
              type="primary"
              htmlType="submit"
            >
              {modalData ? "Ubah Surat" : "Tambah Surat"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Flex gap="small" justify="space-between">
        <Typography.Title level={2}>Pengajuan Surat</Typography.Title>
        <Button
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          <PlusOutlined />
          Tambah Transaksi Surat
        </Button>
      </Flex>
      <Table
        loading={isLoading}
        columns={columns(onEdit)}
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
