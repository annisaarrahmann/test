import {
  Card,
  Col,
  Flex,
  Row,
  Statistic,
  Table,
  Typography,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import "./home.scss";
import { useQuery } from "@tanstack/react-query";
import {
  getAllMailsCount,
  getAllPendingMails,
  getAllRecievedMails,
  getURL,
  userData,
} from "../../lib/pocketbase";

interface DataType {
  mailNo: string;
  summary: string;
  date: string;
  otherMail: string;
  status: string;
  approver: string;
  mail_file: string;
}

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
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button>
        <Typography.Link href={getURL(record, record.mail_file)}>
          Unduh
        </Typography.Link>
      </Button>
    ),
  },
];

const Home = () => {
  const { data: dataAllMails } = useQuery({
    queryKey: ["countmails"],
    queryFn: getAllMailsCount,
  });
  const { data: dataPendingMails } = useQuery({
    queryKey: ["pendingmails"],
    queryFn: getAllPendingMails,
  });
  const { data: dataRecievedMails, isLoading } = useQuery({
    queryKey: ["recievedMail"],
    queryFn: getAllRecievedMails,
  });
  return (
    <Flex vertical gap="20px">
      <Typography.Title level={2}>Beranda</Typography.Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Jumlah Surat Internal"
              value={dataAllMails?.totalItems}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Jumlah Surat Yang Perlu Disetujui"
              value={dataPendingMails?.totalItems}
            />
          </Card>
        </Col>
      </Row>
      {userData?.departement !== "Pengadaan" ? (
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={
            dataRecievedMails?.items.map((item) => ({
              ...item,
              key: item.id,
              approver: item.expand?.approver?.name,
            })) as any
          }
        />
      ) : null}
    </Flex>
  );
};

export default Home;
