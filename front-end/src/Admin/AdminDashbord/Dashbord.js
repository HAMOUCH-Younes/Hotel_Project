import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
  FaDollarSign,
  FaUsers,
  FaUserPlus,
  FaShoppingCart,
} from 'react-icons/fa';
import Layout from '../Layout/Layout';
import SalesOverview from '../AdminDashbord/Compenents/SalesOverview ';
import Promo from '../AdminDashbord/Compenents/Promo';

const cardData = [
  {
    title: "TODAY'S MONEY",
    value: '$53,000',
    change: '+55% since yesterday',
    icon: <FaDollarSign color="#00bcd4" />,
    changeColor: 'green',
    iconBg: '#e0f7fa',
  },
  {
    title: "TODAY'S USERS",
    value: '2,300',
    change: '+3% since last week',
    icon: <FaUsers color="#f44336" />,
    changeColor: 'green',
    iconBg: '#fdecea',
  },
  {
    title: 'NEW CLIENTS',
    value: '+3,462',
    change: '-2% since last quarter',
    icon: <FaUserPlus color="#4caf50" />,
    changeColor: 'red',
    iconBg: '#e8f5e9',
  },
  {
    title: 'SALES',
    value: '$103,430',
    change: '+5% than last month',
    icon: <FaShoppingCart color="#ff9800" />,
    changeColor: 'green',
    iconBg: '#fff3e0',
  },
];

const Dashboard = () => {
  return (
    <Layout>
      <div style={{ marginTop: '70px', position: 'relative', zIndex: 2 }}>
        <Row className="g-4 mb-3">
          {cardData.map((item, idx) => (
            <Col md={3} key={idx}>
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  fontFamily: 'Poppins, sans-serif',
                 
                  backgroundColor: '#fff',
                }}
                
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#7b809a',
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        color: '#344767',
                        margin: '0.4rem 0',
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: item.changeColor === 'red' ? '#f44336' : '#4caf50',
                        fontWeight: 500,
                         whiteSpace: 'nowrap', // Prevent line break
                      }}
                    >
                      {item.change}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: item.iconBg,
                      borderRadius: '50%',
                      padding: '0.6rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '44px',
                      width: '44px',
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Graph + Promo */}
        <Row className="g-4">
          <Col md={7}>
            <SalesOverview />
          </Col>
          <Col md={5}>
            <Promo />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Dashboard;
