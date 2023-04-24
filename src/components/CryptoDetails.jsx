import React, { useState } from 'react';
// import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');
  const { data: coinDetail, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timeperiod });
  const coinDetails = coinDetail?.data?.coin;
  // console.log(coinDetails);

  if (isFetching) return <Loader />;

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${coinDetails?.price && millify(coinDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: coinDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${coinDetails?.volume && millify(coinDetails?.volume)}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${coinDetails?.marketCap && millify(coinDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${coinDetails?.allTimeHigh?.price && millify(coinDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: coinDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: coinDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Aprroved Supply', value: coinDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${coinDetails?.supply?.total && millify(coinDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${coinDetails?.supply?.circulating && millify(coinDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (

    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {coinDetails?.name} ({coinDetails?.symbol}) Price
        </Title>
        <p>{coinDetails?.name} live price in US Dollar (USD). View value statistics, market cap and supply.</p>
      </Col>
      <Select defaultValue="7d" className="select-timeperiod" placeholder="Select Timeperiod" onChange={(value) => setTimeperiod(value)}>
        {time.map((date) => <Option key={date}>{date}</Option>)}
      </Select>
      <LineChart coinHistory={coinHistory} currentPrice={millify(coinDetails?.price)} coinName={coinDetails?.name} />
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">{coinDetails?.name} Value Statistics</Title>
            <p>An overview showing the statistics of {coinDetails?.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">Other Stats Info</Title>
            <p>An overview showing the statistics of {coinDetails?.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats">
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link">
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">{coinDetails?.name} Links</Title>
          {coinDetails?.links?.map((link) => (
            <Row className="coin-link" key={link.name}>
              <Title level={5} className="link-name">{link.type}</Title>
              <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;
