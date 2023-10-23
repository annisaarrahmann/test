import {
  Flex,
  Typography,
  Table,
  Tag,
  Button,
  notification,
  Space,
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
              Download
            </Typography.Link>
          </Button>
        </Space>
      ) : null,
  },
  {
    title: "Tujuan",
    dataIndex: "reciever",
    key: "reciever",
  },
];

const MailApproval = () => {
  const [api, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ["pendingmails"],
    queryFn: getAllPendingMails,
  });

  const { mutateAsync, isLoading: isLoadingAction } = useMutation({
    mutationFn: updateMail,
  });

  const onAction = async (values: any, action: string) => {
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

  return (
    <Flex vertical>
      {contextHolder}

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
