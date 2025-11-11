import React, { Component } from 'react';
import { Rocket, ShoppingCart, Palette, User, Wrench, FileText, Search, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import './HelpCenter.css';

class HelpCenter extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      activeCategory: 'getting-started',
      expandedFAQ: null
    };
  }

  componentDidMount() {
    // Set page title
    document.title = 'Help Center - ArtHive';
  }

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  setActiveCategory = (category) => {
    this.setState({ activeCategory: category, expandedFAQ: null });
  };

  toggleFAQ = (faqId) => {
    this.setState({
      expandedFAQ: this.state.expandedFAQ === faqId ? null : faqId
    });
  };

  render() {
    const { user, logout } = this.context;
    const { searchQuery, activeCategory, expandedFAQ } = this.state;

    const categories = [
      { id: 'getting-started', label: 'Getting Started', icon: Rocket },
      { id: 'buying', label: 'Buying Art', icon: ShoppingCart },
      { id: 'selling', label: 'Selling Art', icon: Palette },
      { id: 'account', label: 'Account & Profile', icon: User },
      { id: 'technical', label: 'Technical Issues', icon: Wrench },
      { id: 'policies', label: 'Policies & Safety', icon: FileText }
    ];

    const faqs = {
      'getting-started': [
        {
          id: 'what-is-arthive',
          question: 'What is ArtHive?',
          answer: 'ArtHive is a digital marketplace where artists can sell their digital artwork and collectors can discover and purchase unique digital pieces. We support various formats including illustrations, digital paintings, 3D models, and more.'
        },
        {
          id: 'how-to-signup',
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner and fill out the registration form with your email, name, and password. You can also sign up with your Google account for faster registration.'
        },
        {
          id: 'browsing-art',
          question: 'How do I browse and discover artwork?',
          answer: 'Use the Explore page to browse all available artwork. You can filter by category, price range, artist, and more. Each artwork has detailed information including the artist\'s profile and reviews.'
        }
      ],
      'buying': [
        {
          id: 'how-to-buy',
          question: 'How do I purchase artwork?',
          answer: '1. Find artwork you like on the Explore page. 2. Click on the artwork to view details. 3. Click "Add to Cart" or "Buy Now". 4. Complete checkout with your payment information. 5. Download your purchase immediately after payment.'
        },
        {
          id: 'payment-methods',
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.'
        },
        {
          id: 'download-files',
          question: 'How do I download my purchased artwork?',
          answer: 'After successful payment, you\'ll receive an email with download links. You can also access your purchases from your profile under "My Purchases". Files are available in high-resolution formats.'
        },
        {
          id: 'refund-policy',
          question: 'What is your refund policy?',
          answer: 'Digital artwork purchases are generally non-refundable due to the nature of digital goods. However, if there\'s a technical issue preventing download or the file is corrupted, please contact support within 7 days for assistance.'
        }
      ],
      'selling': [
        {
          id: 'how-to-sell',
          question: 'How do I start selling my artwork?',
          answer: '1. Create an account and complete your artist profile. 2. Click "Upload Artwork" to add your digital creations. 3. Fill in artwork details, pricing, and categories. 4. Submit for approval. 5. Once approved, your artwork goes live on the marketplace.'
        },
        {
          id: 'pricing-artwork',
          question: 'How should I price my artwork?',
          answer: 'Consider your experience, artwork complexity, uniqueness, and market demand. Research similar artwork prices. We suggest starting with competitive pricing and adjusting based on sales and feedback.'
        },
        {
          id: 'earning-money',
          question: 'How do I get paid for my sales?',
          answer: 'Earnings are paid out monthly via PayPal or direct bank transfer. You need to reach the minimum payout threshold of $50. Processing takes 3-5 business days after the payout period ends.'
        },
        {
          id: 'artwork-approval',
          question: 'Why was my artwork rejected?',
          answer: 'Artwork may be rejected if it violates our content policies, contains copyrighted material, or doesn\'t meet quality standards. You\'ll receive specific feedback and can resubmit after making changes.'
        }
      ],
      'account': [
        {
          id: 'edit-profile',
          question: 'How do I edit my profile?',
          answer: 'Go to your profile page and click "Edit Profile". You can update your bio, profile picture, social links, and other personal information.'
        },
        {
          id: 'change-password',
          question: 'How do I change my password?',
          answer: 'Visit Settings > Security and click "Change Password". You\'ll need to enter your current password and choose a new one.'
        },
        {
          id: 'delete-account',
          question: 'How do I delete my account?',
          answer: 'Account deletion is permanent and will remove all your data. Contact support through the help center to request account deletion. This process takes 30 days to complete.'
        }
      ],
      'technical': [
        {
          id: 'upload-issues',
          question: 'I\'m having trouble uploading artwork',
          answer: 'Check that your file is under 50MB and in a supported format (PNG, JPG, GIF, MP4, etc.). Clear your browser cache and try again. If issues persist, try a different browser or contact support.'
        },
        {
          id: 'download-issues',
          question: 'I can\'t download my purchase',
          answer: 'Check your email for the download link. If it\'s expired, go to your profile > My Purchases to regenerate the link. Ensure your antivirus isn\'t blocking the download.'
        },
        {
          id: 'browser-compatibility',
          question: 'Which browsers are supported?',
          answer: 'ArtHive works best with modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. We recommend keeping your browser updated for the best experience.'
        }
      ],
      'policies': [
        {
          id: 'content-policy',
          question: 'What content is allowed?',
          answer: 'We allow original digital artwork. Prohibited content includes copyrighted material, offensive imagery, illegal content, and anything violating our community guidelines. See our full policies for details.'
        },
        {
          id: 'copyright-infringement',
          question: 'How do I report copyright infringement?',
          answer: 'Use the "Report" button on any artwork or contact support with details about the infringement. We take copyright violations seriously and will remove offending content.'
        },
        {
          id: 'privacy-policy',
          question: 'How do you protect my privacy?',
          answer: 'We collect minimal personal information needed for transactions. Your payment information is never stored on our servers. See our Privacy Policy for complete details.'
        }
      ]
    };

    const filteredFAQs = faqs[activeCategory] || [];

    return (
      <div className="help-center">
        {/* Header */}
        <header className="help-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="display-lg">Help Center</h1>
              <p className="text-lg text-secondary">Find answers to common questions and get support</p>
            </div>
            {user && <ProfileDropdown user={user} onLogout={logout} />}
          </div>
        </header>

        {/* Search Bar */}
        <div className="help-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={this.handleSearch}
              className="search-input"
            />
            <button className="search-button">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="help-content">
          <div className="help-sidebar">
            <h2 className="sidebar-title">Categories</h2>
            <nav className="category-nav">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => this.setActiveCategory(category.id)}
                  >
                    <span className="category-icon">
                      <IconComponent size={20} />
                    </span>
                    <span className="category-label">{category.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="contact-support">
              <h3>Still need help?</h3>
              <p>Can't find what you're looking for? Our support team is here to help.</p>
              <button className="contact-button">Contact Support</button>
            </div>
          </div>

          <div className="help-main">
            <div className="category-header">
              <h2 className="category-title">
                {(() => {
                  const activeCat = categories.find(cat => cat.id === activeCategory);
                  const IconComponent = activeCat?.icon;
                  return (
                    <>
                      <IconComponent size={24} /> {activeCat?.label}
                    </>
                  );
                })()}
              </h2>
              <p className="category-description">
                {activeCategory === 'getting-started' && 'Learn the basics of using ArtHive'}
                {activeCategory === 'buying' && 'Everything you need to know about purchasing artwork'}
                {activeCategory === 'selling' && 'Tips and guidelines for selling your digital art'}
                {activeCategory === 'account' && 'Manage your account settings and preferences'}
                {activeCategory === 'technical' && 'Troubleshoot common technical issues'}
                {activeCategory === 'policies' && 'Understand our policies and community guidelines'}
              </p>
            </div>

            <div className="faq-list">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => this.toggleFAQ(faq.id)}
                    aria-expanded={expandedFAQ === faq.id}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-toggle ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HelpCenter;