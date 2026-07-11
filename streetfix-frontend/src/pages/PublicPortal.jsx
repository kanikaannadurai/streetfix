import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Table } from 'react-bootstrap';
import api from '../services/api';

const PublicPortal = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching public dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading Transparency Dashboard...</p>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container className="mt-5 text-center">
        <h4 className="text-danger">Failed to load statistics.</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Public Transparency Portal</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Total Complaints</Card.Title>
              <h1 className="display-4 text-primary">{stats.totalComplaints}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Resolved Complaints</Card.Title>
              <h1 className="display-4 text-success">{stats.resolvedComplaints}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title>Pending Complaints</Card.Title>
              <h1 className="display-4 text-warning">{stats.pendingComplaints}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Category Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.categoryStats || {}).map(([category, count]) => (
                    <tr key={category}>
                      <td>{category}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                  {Object.keys(stats.categoryStats || {}).length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center">No category data available.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Ward-wise Statistics</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Ward</th>
                    <th>Complaints</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.wardStats || {}).map(([ward, count]) => (
                    <tr key={ward}>
                      <td>{ward}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicPortal;
