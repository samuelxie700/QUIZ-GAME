'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function WombatCharacterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const avatar = params.get('avatar') ?? '';
  
  const [debug, setDebug] = useState<boolean>(false);

  const onConfirm = () => {
    const url = `/play?avatar=${encodeURIComponent(avatar)}&partner=wombat`;
    router.push(url);
  };

  const navigateToCharacter = (character: string) => {
    const url = `/play/q1/${character}?avatar=${encodeURIComponent(avatar)}`;
    router.push(url);
  };

  const characters = [
    { id: 'crocodile', name: 'Crocodile', selected: false },
    { id: 'kangaroo', name: 'Kangaroo', selected: false },
    { id: 'wombat', name: 'Wombat', selected: true },
    { id: 'koala', name: 'Koala', selected: false }
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-200">
      <div className="w-[390px] h-[844px] rounded-[28px] shadow-2xl overflow-hidden relative">
        {/* 背景 - 深蓝色渐变，匹配设计图 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c3e50] to-[#1a252f]"></div>

        {/* 主要内容容器 */}
        <div className="relative h-full flex flex-col">
          {/* 顶部标题区域 */}
          <div className="pt-8 pb-4 text-center">
            <img 
              src="/partners/ui/wild-partner-title.png"
              alt="Who's your wild partner on this epic journey through Australia?"
              className="w-full max-w-[300px] mx-auto select-none pointer-events-none"
              draggable={false}
            />
          </div>

          {/* 角色选择区域 */}
          <div className="flex-1 flex flex-col items-center">
            {/* 角色头像 - 单排四个，wombat选中 */}
            <div className="grid grid-cols-4 gap-[20px] mb-12">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className={`w-[72px] h-[80px] cursor-pointer transition-all duration-200 relative ${
                    character.selected 
                      ? 'scale-110 opacity-100' 
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  onClick={() => !character.selected && navigateToCharacter(character.id)}
                >
                  <img 
                    src={`/partners/icons/${character.id.toUpperCase()}_ICON.png`}
                    alt={character.name}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                  {/* 选中状态的高亮边框 */}
                  {character.selected && (
                    <div className="absolute top-1 left-0 right-0 bottom-1 border-4 border-orange-500 rounded-lg shadow-lg shadow-orange-500/50"></div>
                  )}
                </div>
              ))}
            </div>

            {/* 袋熊角色大图 */}
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
              {/* 袋熊大图容器 */}
              <div className="relative mb-6">
                <img 
                  src="/partners/characters/PARTNER_-_WOMBAT.png"
                  alt="Wombat Partner"
                  className="w-80 h-80 object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </div>
              
              {/* 角色名称 */}
              <div className="text-center">
                <img 
                  src="/partners/titles/Wombat Warrior.png"
                  alt="Warrior"
                  className="max-w-[200px] mx-auto select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* 底部内容下沉，贴近截图排版 */}
            <div className="mt-auto w-full flex flex-col items-center">
              {/* 确认按钮 - 使用图片背景 */}
              <button 
                onClick={onConfirm}
                aria-label="Confirm"
                className="relative w-[248px] h-[48px] mb-3 select-none opacity-100"
              >
                <img 
                  src="/partners/ui/frame1.png"
                  alt="Confirm Button"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </button>

              {/* 底部提示文字 */}
              <div className="mb-8">
                <img 
                  src="/partners/ui/select-confirm.png"
                  alt="Select Character then Confirm"
                  className="max-w-[200px] mx-auto select-none pointer-events-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Debug 模式 */}
        {debug && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
            Debug Mode: Wombat Warrior Character Selected
          </div>
        )}
        
        <button
          onClick={() => setDebug(!debug)}
          className="absolute bottom-4 left-4 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-30 hover:opacity-100"
        >
          Debug
        </button>
      </div>
    </main>
  );
} 