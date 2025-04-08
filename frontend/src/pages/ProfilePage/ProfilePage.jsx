import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowLeft, Camera, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="flex max-w-7xl w-full bg-white text-black rounded-2xl shadow-lg overflow-hidden flex-col sm:flex-row">

        {/* Left Section - Profile Image */}
        <div className="w-full sm:w-1/3 relative max-h-full sm:h-auto">
          <img
            src={selectedImg || authUser.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl transition-transform duration-300 hover:scale-105"
          />
          {/* Profile Picture Change Button */}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-4 right-4 bg-black bg-opacity-40 text-white p-3 rounded-full cursor-pointer hover:bg-opacity-60 transition-all"
          >
            <Camera className="w-6 h-6" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>

        {/* Right Section - User Details */}
        <div className="w-full sm:w-2/3 p-8 sm:p-12 space-y-6 sm:space-y-8">
          {/* Back to Home Button */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Full Name and Position */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">{authUser?.fullName || "Miraz"}</h1>
            {/* <p className="text-lg text-gray-500">Position or Role</p> */}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-6 py-3 bg-gray-100 rounded-lg border border-gray-200 shadow-sm">{authUser?.email || "example@email.com"}</p>
          </div>

          {/* Account Info */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-800">Account Information</h2>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0] || "2020-01-01"}</span>
              </div>
              <div className="flex justify-between py-3">
                <span>Account Status</span>
                <span className="text-green-500 font-semibold">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
