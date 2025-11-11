import React from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Star,
  Heart,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Users,
  Folder,
  ThumbsUp,
  Clock,
  Palette,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  LogIn,
  UserPlus,
  AlertCircle,
  Check,
  X,
  Loader,
  Image,
  FileText,
  CreditCard,
  Shield,
  Zap
} from "lucide-react";

const DEFAULT_SIZE = 18;

export function Icon({ name, size = DEFAULT_SIZE, title, className = "", ...rest }) {
  const common = {
    size,
    role: title ? 'img' : undefined,
    'aria-hidden': title ? undefined : true,
    ...rest
  };

  const map = {
    // Core navigation & UI
    search: <Search {...common} className={className} />,
    cart: <ShoppingCart {...common} className={className} />,
    bell: <Bell {...common} className={className} />,
    user: <User {...common} className={className} />,
    home: <Home {...common} className={className} />,

    // Status & feedback
    star: <Star {...common} className={className} />,
    heart: <Heart {...common} className={className} />,
    check: <CheckCircle {...common} className={className} />,
    cross: <XCircle {...common} className={className} />,
    eye: <Eye {...common} className={className} />,
    thumbsUp: <ThumbsUp {...common} className={className} />,

    // Communication
    mail: <Mail {...common} className={className} />,

    // Security & access
    lock: <Lock {...common} className={className} />,
    shield: <Shield {...common} className={className} />,

    // Content & files
    folder: <Folder {...common} className={className} />,
    image: <Image {...common} className={className} />,
    fileText: <FileText {...common} className={className} />,
    upload: <Upload {...common} className={className} />,
    download: <Download {...common} className={className} />,

    // Actions
    edit: <Edit {...common} className={className} />,
    trash: <Trash2 {...common} className={className} />,
    plus: <Plus {...common} className={className} />,
    minus: <Minus {...common} className={className} />,
    settings: <Settings {...common} className={className} />,

    // Navigation arrows
    chevronDown: <ChevronDown {...common} className={className} />,
    chevronUp: <ChevronUp {...common} className={className} />,
    chevronLeft: <ChevronLeft {...common} className={className} />,
    chevronRight: <ChevronRight {...common} className={className} />,

    // Auth & user management
    logOut: <LogOut {...common} className={className} />,
    logIn: <LogIn {...common} className={className} />,
    userPlus: <UserPlus {...common} className={className} />,
    users: <Users {...common} className={className} />,

    // Status indicators
    alert: <AlertCircle {...common} className={className} />,
    success: <Check {...common} className={className} />,
    error: <X {...common} className={className} />,
    loading: <Loader {...common} className={className} />,

    // Art & creative
    palette: <Palette {...common} className={className} />,

    // Time & scheduling
    clock: <Clock {...common} className={className} />,

    // Payment
    creditCard: <CreditCard {...common} className={className} />,

    // Special
    zap: <Zap {...common} className={className} />
  };

  return map[name] ?? null;
}