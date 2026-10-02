import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

describe('Softly Landing Page', () => {
  it('renders brand name and navigation CTAs', () => {
    render(<LandingPage />);
    expect(screen.getByText('Softly')).toBeInTheDocument();
    expect(screen.getAllByText(/launch care hub/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/helper access portal/i)).toBeInTheDocument();
  });

  it('renders hero headline with cursive emphasis', () => {
    render(<LandingPage />);
    expect(screen.getByText(/caring for parents from afar,/i)).toBeInTheDocument();
    expect(screen.getByText(/gently\./i)).toBeInTheDocument();
  });

  it('renders scenario scroll section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/daily living room rhythm/i)).toBeInTheDocument();
    expect(screen.getByText(/metformin reminder sent to dad’s whatsapp/i)).toBeInTheDocument();
  });

  it('renders 3-phone experience preview with pulsing coral button', () => {
    render(<LandingPage />);
    expect(screen.getByText(/designed like a warm, tactile living room/i)).toBeInTheDocument();
    expect(screen.getByText(/take a deep breath/i)).toBeInTheDocument();
  });

  it('renders diary entry testimonials and FAQ section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/letters from sons & daughters across cities/i)).toBeInTheDocument();
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    expect(screen.getByText(/bring peace to your family rhythm/i)).toBeInTheDocument();
  });
});
