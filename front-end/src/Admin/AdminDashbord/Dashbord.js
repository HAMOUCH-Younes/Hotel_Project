import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaDollarSign, FaUsers, FaUserPlus, FaShoppingCart } from 'react-icons/fa';
import Layout from '../Layout/Layout';
import SalesOverview from '../AdminDashbord/Compenents/SalesOverview ';
import Promo from '../AdminDashbord/Compenents/Promo';

const Dashboard = () => {
  return (
    <Layout>
      {/* Content wrapper with reduced top margin */}
      <div style={{ marginTop: '70px', position: 'relative', zIndex: 2 }}>
        {/* Top Cards */}
        <Row className="g-4 mb-3">
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                borderRadius: '1.2rem',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-50">TODAY'S MONEY</small>
                  <h3 className="mb-0 mt-2">$53,000</h3>
                  <small className="text-success">+55% since yesterday</small>
                </div>
                <FaDollarSign size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                borderRadius: '1.2rem',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-50">TODAY'S USERS</small>
                  <h3 className="mb-0 mt-2">2,300</h3>
                  <small className="text-success">+3% since last week</small>
                </div>
                <FaUsers size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                borderRadius: '1.2rem',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-50">NEW CLIENTS</small>
                  <h3 className="mb-0 mt-2">+3,462</h3>
                  <small className="text-danger">-2% since last quarter</small>
                </div>
                <FaUserPlus size={28} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card
              className="p-4 shadow-sm"
              style={{
                borderRadius: '1.2rem',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-50">SALES</small>
                  <h3 className="mb-0 mt-2">$103,430</h3>
                  <small className="text-success">+5% than last month</small>
                </div>
                <FaShoppingCart size={28} />
              </div>
            </Card>
          </Col>
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