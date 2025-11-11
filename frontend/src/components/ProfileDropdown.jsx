import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './icons';
import './ProfileDropdown.css';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      const menuItems = getMenuItems();
      const focusableItems = menuItems.filter(item => item.type !== 'divider');

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          avatarRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev < focusableItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev =>
            prev > 0 ? prev - 1 : focusableItems.length - 1
          );
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(focusableItems.length - 1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < focusableItems.length) {
            handleMenuItemClick(focusableItems[focusedIndex]);
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    let initials = names[0].charAt(0);
    if (names.length > 1) {
      initials += names[1].charAt(0);
    }
    return initials.toUpperCase();
  };

  const getMenuItems = () => {
    return [
      { type: 'link', label: 'Home', icon: 'home', href: '/', shortcut: null },
      { type: 'link', label: 'Explore', icon: 'compass', href: '/explore', shortcut: null },
      { type: 'link', label: 'My Profile', icon: 'user', href: '/profile', shortcut: null },
      { type: 'link', label: 'Cart', icon: 'shopping-cart', href: '/cart', shortcut: null },
      { type: 'divider' },
      { type: 'link', label: 'Help Center', icon: 'help-circle', href: '/help', shortcut: null },
      { type: 'link', label: 'What\'s new', icon: 'bell', href: '/whats-new', shortcut: null },
      { type: 'link', label: 'Settings', icon: 'settings', href: '/settings', shortcut: null },
      { type: 'divider' },
      { type: 'action', label: 'Sign out', icon: 'log-out', action: onLogout, shortcut: null, danger: true }
    ];
  };

  const handleMenuItemClick = (item) => {
    if (item.type === 'link') {
      window.location.href = item.href;
    } else if (item.type === 'action') {
      item.action();
    } else if (item.type === 'toggle') {
      item.onChange();
    }
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const renderMenuItem = (item, index) => {
    const isFocused = focusedIndex === index;

    if (item.type === 'divider') {
      return <div key={`divider-${index}`} className="dropdown-divider" />;
    }

    const baseClasses = `dropdown-item ${item.danger ? 'danger' : ''} ${isFocused ? 'focused' : ''}`;

    if (item.type === 'toggle') {
      return (
        <div
          key={item.label}
          className={`${baseClasses} toggle-item`}
          role="menuitemcheckbox"
          aria-checked={item.checked}
          tabIndex={isFocused ? 0 : -1}
          onClick={() => handleMenuItemClick(item)}
        >
          <Icon name={item.icon} size={18} />
          <span className="item-label">{item.label}</span>
          {item.shortcut && <span className="item-shortcut">{item.shortcut}</span>}
          <div className={`toggle-switch ${item.checked ? 'checked' : ''}`}>
            <div className="toggle-slider" />
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.label}
        className={baseClasses}
        role={item.type === 'action' ? 'menuitem' : 'menuitem'}
        tabIndex={isFocused ? 0 : -1}
        onClick={() => handleMenuItemClick(item)}
      >
        <Icon name={item.icon} size={18} />
        <span className="item-label">{item.label}</span>
        {item.shortcut && <span className="item-shortcut">{item.shortcut}</span>}
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const menuItems = getMenuItems();

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-avatar"
        onClick={toggleDropdown}
        ref={avatarRef}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User menu"
      >
        <span className="avatar-initials">{getInitials(user?.name)}</span>
        <Icon name="chevron-down" size={12} className="avatar-chevron" />
      </button>

      {isOpen && (
        <div
          className="dropdown-panel"
          role="menu"
          aria-label="User menu"
        >
          <div className="dropdown-header">
            <div className="header-avatar">
              <span className="avatar-initials">{getInitials(user?.name)}</span>
            </div>
            <div className="header-info">
              <div className="header-name">{user?.name}</div>
              <div className="header-email">{user?.email}</div>
            </div>
          </div>

          <div className="dropdown-content">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;