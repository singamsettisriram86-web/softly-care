import React from 'react';
import { render, screen } from '@testing-library/react';
import GrainOverlay from '@/components/GrainOverlay';

describe('GrainOverlay', () => {
  it('renders the noise texture overlay element', () => {
    render(<GrainOverlay />);
    const overlay = screen.getByTestId('grain-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('pointer-events-none');
    expect(overlay).toHaveClass('opacity-35');
    expect(overlay).toHaveClass('mix-blend-overlay');
  });
});
