import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Link } from "react-router";

import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  LoaderIcon,
} from "lucide-react";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM RIGHT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-l  border-slate-600/30">
              <div className="w-full max-w-md">
                {/* Heading Text */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-1/2 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    أهلاً بك من جديد
                  </h2>
                  <p className="text-slate-400">تسجيل الدخول إلى حسابك</p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="auth-input-label">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="example@example.com"
                      />
                    </div>
                  </div>
                  {/* Password */}
                  <div>
                    <label className="auth-input-label">كلمة المرور</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="كلمة المرور"
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="auth-btn"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to={"/signup"} className="auth-link">
                    لايوجد لديك حساب؟ إنشاء حساب جديد الآن !
                  </Link>
                </div>
              </div>
            </div>
            {/* FORM LEFT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-br from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">
                    في كل مكان وزمان
                  </h3>

                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">مجاناً</span>
                    <span className="auth-badge">سهل البدء</span>
                    <span className="auth-badge">خصوصيّة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};

export default LoginPage;
