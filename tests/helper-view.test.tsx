import React from 'react';
import { render, screen, act } from '@testing-library/react';
import HelperPage from '@/app/helper/page';

describe('Helper Portal View', () => {
  it('renders helper profile and portal title', async () => {
    await act(async () => {
      render(<HelperPage searchParams={{ pin: 'CARE-7892' }} />);
    });
    expect(screen.getByText('Mobile Helper Portal')).toBeInTheDocument();
    expect(screen.getByText('Ramesh Kumar')).toBeInTheDocument();
    expect(screen.getByText('Assisting:')).toBeInTheDocument();
  });
});
