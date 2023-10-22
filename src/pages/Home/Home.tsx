import { Card, Col, Flex, Row, Statistic, Typography } from "antd";

import "./home.scss";
import { useQuery } from "@tanstack/react-query";
import { getAllMailsCount, getAllPendingMails } from "../../lib/pocketbase";

const Home = () => {
  const { data: dataAllMails } = useQuery({
    queryKey: ["countmails"],
    queryFn: getAllMailsCount,
  });
  const { data: dataPendingMails } = useQuery({
    queryKey: ["pendingmails"],
    queryFn: getAllPendingMails,
  });
  return (
    <Flex vertical>
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
    </Flex>
  );
};

export default Home;
