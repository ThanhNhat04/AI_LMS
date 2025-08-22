"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";

function Header() {
  const [activePopover, setActivePopover] = useState(null); 
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const closeTimer = useRef(null);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  const handleEnter = (type) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActivePopover(type);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActivePopover(null);
    }, 100);
  };

  return (
    <>
      <div className="header">
        <div className="header-container">
          {/* Logo + Search */}
          <div className="header-left">
            <img
              src="/images/logo.png"
              alt="Khoá học"
              className="logo"
              onClick={() => router.push("/")}
            />
            <div className="search-box">
              <SearchIcon className="search-icon" fontSize="small" />
              <input type="text" placeholder="Tìm kiếm khóa học, bài viết..." />
            </div>
          </div>

          <div className="header-right">
            {/* Notification */}
            <div
              className="notif-wrapper"
              onMouseEnter={() => handleEnter("notif")}
              onMouseLeave={handleLeave}
            >
              <button className="icon-btn">
                <NotificationsNoneIcon />
              </button>
              <div
                className={`notif-popover ${activePopover === "notif" ? "show" : "hide"}`}
              >
                <div className="tabs">
                  <div
                    className={`tab ${tab === 0 ? "active" : ""}`}
                    onClick={() => setTab(0)}
                  >
                    Tất cả
                  </div>
                  <div
                    className={`tab ${tab === 1 ? "active" : ""}`}
                    onClick={() => setTab(1)}
                  >
                    Chưa đọc
                  </div>
                </div>
                <div style={{ padding: "12px", color: "black" }}>
                  Bạn chưa có thông báo nào
                </div>
              </div>
            </div>

            {/* Avatar menu */}
            <div
              className="avatar-wrapper"
              onMouseEnter={() => handleEnter("menu")}
              onMouseLeave={handleLeave}
              style={{ position: "relative" }}
            >
              <button className="icon-btn">
                <Avatar sx={{ width: 40, height: 40 }}></Avatar>
              </button>
              <div className={`menu ${activePopover === "menu" ? "show" : "hide"}`}>
                <div className="menu-item" onClick={() => setActivePopover(null)}>
                  Hồ sơ của tôi
                </div>
                <div className="menu-item" onClick={handleLogOut}>
                  Thoát
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .header { width: 100%; background: white; color: black; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header-container { max-width: 1550px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 8px 32px; }
          .header-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
          .logo { height: 40px; cursor: pointer; }

          .search-box { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 9999px; padding: 6px 12px; flex: 1; max-width: 400px; min-width: 0; background: #f9f9f9; transition: all 0.3s ease; }
          .search-icon { margin-right: 8px; color: #888; }
          .search-box input { border: none; outline: none; flex: 1; font-size: 14px; background: transparent; }

          .header-right { display: flex; align-items: center; gap: 12px; position: relative; }
          .icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: background 0.2s; }
          .icon-btn:hover { background: #f0f0f0; }

          /* Popover base */
          .notif-popover, .menu {
            position: absolute;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-5px);
            transition: all 0.25s ease;
          }
          .notif-popover.show, .menu.show { opacity: 1; visibility: visible; transform: translateY(0); }
          .notif-popover.hide, .menu.hide { opacity: 0; visibility: hidden; transform: translateY(-5px); }

          /* Notif */
          .notif-wrapper { position: relative; }
          .notif-popover { top: 40px; width: 350px; padding: 12px; }
          .tabs { display: flex; border-bottom: 1px solid #ddd; margin-bottom: 8px; }
          .tab { flex: 1; text-align: center; padding: 8px; cursor: pointer; }
          .tab.active { border-bottom: 2px solid #87CEFA; font-weight: bold; color: #87CEFA; }

          /* Avatar menu */
          .menu { top: 50px; min-width: 200px; }
          .menu-item { padding: 10px 18px; cursor: pointer; white-space: nowrap; border-bottom: 1px solid #f0f0f0; }
          .menu-item:hover { background: #f5f5f5; }
        `}</style>
      </div>
    </>
  );
}

export default Header;
