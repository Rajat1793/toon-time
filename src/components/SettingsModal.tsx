import { Volume2, Grid, User, ShieldCheck } from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  appSettings: AppSettings;
  setAppSettings: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void;
  isDottedBgOn: boolean;
}

const AVATARS = [
  {
    name: 'Popeye',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkZ4Mn4Z2QfnX3lt5FPihsu_9w50_J5EW_Qs0dZMk9kugNRhJCQkn15c_TcFca0mj1qb9971hpeXDJNlz-U2LX6VlMuA60LH99F_IQIy9rlByajrQ013xYNbBgTk6iWn72w_PyoJ8N9DgnLO8U3gy9bmOBuaUXmlPQrhnD8tXBhbDs-3PWJ_mBd3I6hYWlOQ-kix7UHYIj9jUx-5-Agg833ZZKdhqRw5QTlSfxrpoVkQn9NpCzOLq08hDFpnm6YXHPfrWdaARupVor'
  },
  {
    name: 'Olive Oyl',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-I93ddeKr3YmEjhql5lGs7n93UzFXcIEPgUwuPZ5M75j94mwzo_zIxcY5Igs6tXDjnWUfvUTTMbu8Q2gTbQ18bGICFrNqOe6ViVaedVXj1CKt3nc93E5pAjJvmeB_RDnaDFj_aXp2Yc5n-bvT4N_aXoA28jOHhiqrBS0Fyix3qsBab-vPPbSRzto543DyzEUEkthyRARdcCXdnUM8NER8N55BXxgSv-lIXkdxnH9HXhiS878fNntQuub0KtFECY3bPfgMsp5bE6kw'
  },
  {
    name: 'Bluto',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_QCoKn5lmHev9riG6Js3Cl6_OhQ-O_ulg5GQK5j7cSx2K1JniQGt0xsd1PEkdjcpXn13Jr8rcOLc0j1GZvweFMkCzAOZKZswSDmAmE0W4WFG3vMF3NI-g3f8Q5JmL1APMf4RF61g3r5RZaMvEtzg-t0q__3ie49ZuTWVTkznipPWOHnjPiUVmMVIYAQyxZXrzi8MyipVsd0vzSa8cPBu6WQkjWqo-LYcdxEdRiVQSW6z8kSbpPvJ4tICTHSh1XHtI_dfNLzPL48H0'
  }
];

export default function SettingsModal({
  onClose,
  userProfile,
  setUserProfile,
  appSettings,
  setAppSettings,
  isDottedBgOn,
}: SettingsModalProps) {
  const modalBg   = isDottedBgOn ? 'bg-[#FBF5DD]'          : 'bg-[#0D530E]';
  const cardBg    = isDottedBgOn ? 'bg-[#F0EDCF]'          : 'bg-[#16421A]';
  const iconBg    = isDottedBgOn ? 'bg-[#E7E1B1]'          : 'bg-[#16421A]';
  const borderC   = isDottedBgOn ? 'border-[#0D530E]/15'   : 'border-[#FBF5DD]/15';
  const borderF   = isDottedBgOn ? 'border-[#0D530E]/10'   : 'border-[#FBF5DD]/10';
  const textPri   = isDottedBgOn ? 'text-[#0D530E]'        : 'text-[#FBF5DD]';
  const textSec   = isDottedBgOn ? 'text-[#0D530E]/80'     : 'text-[#FBF5DD]/80';
  const textMut   = isDottedBgOn ? 'text-[#0D530E]/50'     : 'text-[#FBF5DD]/50';
  const inputText = isDottedBgOn ? 'text-[#0D530E]'        : 'text-[#FBF5DD]';
  const inputBg   = isDottedBgOn ? 'bg-[#E7E1B1]'          : 'bg-[#16421A]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fadeIn">
      <div className={`${modalBg} border ${borderC} rounded-3xl w-full max-w-sm p-6 ${textPri} relative shadow-2xl select-none`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border ${borderC} ${iconBg} ${textPri} flex items-center justify-center font-bold text-sm cursor-pointer`}
        >
          ✕
        </button>

        {/* Header */}
        <div className={`flex items-center gap-2.5 mb-5 border-b ${borderC} pb-2`}>
          <ShieldCheck className="w-5 h-5 text-[#306D29]" />
          <h3 className={`font-heading text-lg font-black ${textPri} italic tracking-tight`}>
            Captain Settings
          </h3>
        </div>

        {/* Username form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest ${textMut} mb-1`}>
              Captain Display Name
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-2.5 w-4 h-4 ${isDottedBgOn ? 'text-[#0D530E]/40' : 'text-[#FBF5DD]/40'}`} />
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value || 'Popeye' }))}
                maxLength={15}
                className={`w-full pl-10 pr-4 py-2 border ${borderC} focus:border-[#306D29] rounded-xl text-sm font-sans focus:outline-none ${inputBg} ${inputText} font-semibold`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-bold uppercase tracking-widest ${textMut} mb-1`}>
              Select Character Avatar
            </label>
            <div className={`flex justify-around gap-2 mt-2 ${cardBg} p-2 border ${borderF} rounded-xl`}>
              {AVATARS.map((avatar) => {
                const isSelected = userProfile.avatarUrl === avatar.url;
                return (
                  <button
                    key={avatar.name}
                    type="button"
                    onClick={() => {
                      setUserProfile({
                        name: avatar.name,
                        role: avatar.name === 'Popeye' ? 'Captain' : avatar.name === 'Olive Oyl' ? 'First Mate' : 'Quartermaster',
                        avatarUrl: avatar.url,
                      });
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#306D29] border-[#306D29] text-[#FBF5DD] scale-105' 
                        : `border-transparent ${textMut} hover:${textPri}`
                    }`}
                  >
                    <img
                      src={avatar.url}
                      className={`w-10 h-10 rounded-full border ${borderC} ${isDottedBgOn ? 'bg-[#F0F0F0]' : 'bg-black/40'} object-cover object-center`}
                      alt={avatar.name}
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-sans font-bold uppercase mt-1">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Switches */}
          <div className={`flex flex-col gap-3.5 mt-2 border-t ${borderC} pt-3`}>
            {/* Toggle Dotted Grid Background */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#306D29]" />
                <span className={`text-xs font-semibold ${textSec}`}>Dotted Canvas Background</span>
              </div>
              <button
                type="button"
                onClick={() => setAppSettings(prev => ({ ...prev, isDottedBgOn: !prev.isDottedBgOn }))}
                className={`w-10 h-5.5 rounded-full border ${borderC} p-0.5 transition-colors relative flex items-center cursor-pointer ${
                  appSettings.isDottedBgOn ? 'bg-[#306D29]' : 'bg-[#FBF5DD]/10'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-250 ${
                  appSettings.isDottedBgOn ? 'translate-x-[18px]' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            {/* Toggle Sound FX */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#306D29]" />
                <span className={`text-xs font-semibold ${textSec}`}>Ship Sound Alarms</span>
              </div>
              <button
                type="button"
                onClick={() => setAppSettings(prev => ({ ...prev, isVolumeOn: !prev.isVolumeOn }))}
                className={`w-10 h-5.5 rounded-full border ${borderC} p-0.5 transition-colors relative flex items-center cursor-pointer ${
                  appSettings.isVolumeOn ? 'bg-[#306D29]' : 'bg-[#FBF5DD]/10'
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-250 ${
                  appSettings.isVolumeOn ? 'translate-x-[18px]' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#306D29] hover:bg-[#0D530E] text-[#FBF5DD] font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer mt-5"
        >
          Confirm Voyage Plan ⚓
        </button>

      </div>
    </div>
  );
}
