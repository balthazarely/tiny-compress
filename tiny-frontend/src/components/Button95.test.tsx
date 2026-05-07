import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button95 } from './Button95';

describe('Button95', () => {
  it('renders with text', () => {
    render(<Button95>Click me</Button95>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button95 onClick={onClick}>Button</Button95>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('calls onMouseDown when pressed', async () => {
    const onMouseDown = vi.fn();
    render(<Button95 onMouseDown={onMouseDown}>Button</Button95>);

    await userEvent.pointer({ keys: '[MouseLeft>]', target: screen.getByRole('button') });
    expect(onMouseDown).toHaveBeenCalled();
  });

  it('calls onMouseUp when released', () => {
    const onMouseUp = vi.fn();
    const { container } = render(<Button95 onMouseUp={onMouseUp}>Button</Button95>);

    const button = container.querySelector('button')!;
    const event = new MouseEvent('mouseup', { bubbles: true });
    button.dispatchEvent(event);
    expect(onMouseUp).toHaveBeenCalled();
  });

  it('calls onMouseLeave when mouse leaves', async () => {
    const onMouseLeave = vi.fn();
    render(<Button95 onMouseLeave={onMouseLeave}>Button</Button95>);

    const button = screen.getByRole('button');
    await userEvent.hover(button);
    await userEvent.unhover(button);
    expect(onMouseLeave).toHaveBeenCalled();
  });

  it('disables when disabled prop is true', () => {
    render(<Button95 disabled>Button</Button95>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5', cursor: 'not-allowed' });
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button95 disabled onClick={onClick}>Button</Button95>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('changes border color when pressed', () => {
    const { rerender } = render(<Button95 isPressed={false}>Button</Button95>);

    let button = screen.getByRole('button');
    expect(button).toHaveStyle({ borderTopColor: '#ffffff' });

    rerender(<Button95 isPressed={true}>Button</Button95>);

    button = screen.getByRole('button');
    expect(button).toHaveStyle({ borderTopColor: '#808080' });
  });

  it('has Windows 95 styling', () => {
    render(<Button95>Button</Button95>);

    const button = screen.getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: '#c0c0c0',
      color: '#000000',
      fontSize: '11px',
      padding: '4px 12px',
      width: '100%',
    });
  });
});
