import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaDollarSign, FaUsers, FaUserPlus, FaShoppingCart } from 'react-icons/fa';
import SalesOverview from './Compenents/SalesOverview ';

const Dashboard = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-white p-3 border-end" style={{ width: '250px', minHeight: '100vh' }}>
        <h5 className="fw-bold mb-4">Argon Dashboard 2 PRO</h5>
        <ul className="list-unstyled">
          <li className="mb-3 fw-bold text-primary">Dashboard</li>
          <li className="mb-3">Tables</li>
          <li className="mb-3">Billing</li>
          <li className="mb-3">Virtual Reality</li>
          <li className="mb-3">RTL</li>
          <li className="text-muted small mt-4">ACCOUNT PAGES</li>
          <li className="mb-2">Profile</li>
          <li>Sign In</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light p-4">
        {/* Top Cards */}
        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="p-3 text-white" style={{ backgroundColor: '#00c6ff', borderRadius: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small>TODAY'S MONEY</small>
                  <h5 className="mb-0">$53,000</h5>
                  <small className="text-success">+55% since yesterday</small>
                </div>
                <FaDollarSign size={24} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-white" style={{ backgroundColor: '#36d1dc', borderRadius: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small>TODAY'S USERS</small>
                  <h5 className="mb-0">2,300</h5>
                  <small className="text-success">+3% since last week</small>
                </div>
                <FaUsers size={24} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-white" style={{ backgroundColor: '#2af598', borderRadius: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small>NEW CLIENTS</small>
                  <h5 className="mb-0">+3,462</h5>
                  <small className="text-danger">-2% since last quarter</small>
                </div>
                <FaUserPlus size={24} />
              </div>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="p-3 text-white" style={{ backgroundColor: '#f7971e', borderRadius: '1rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small>SALES</small>
                  <h5 className="mb-0">$103,430</h5>
                  <small className="text-success">+5% than last month</small>
                </div>
                <FaShoppingCart size={24} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Graph + Promo */}
        <Row className="g-4">
          <Col md={8}>
            <SalesOverview />
          </Col>

          <Col md={4}>
            <Card
              className="text-white h-100 border-0"
              style={{
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                borderRadius: '1rem',
              }}
            >
              <div className="p-4 d-flex flex-column justify-content-between h-100">
                <div>
                  <h6 className="fw-bold">Faster way to create web pages</h6>
                  <p className="small">
                    That's my skill. I'm not really specially talented at anything except for the ability to learn.
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
