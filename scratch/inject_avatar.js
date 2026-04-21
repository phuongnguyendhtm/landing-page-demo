const fs = require('fs');
const path = require('path');

const htmlPath = 'media_output/2026-04-14/Facebook/T004_FreedomMindset/reels/broll.html';
const avatarPath = 'media-input/avatar.jpg';

if (fs.existsSync(avatarPath) && fs.existsSync(htmlPath)) {
    const ext = path.extname(avatarPath).substring(1);
    const base64Data = fs.readFileSync(avatarPath, 'base64');
    const dataUrl = `data:image/${ext};base64,${base64Data}`;
    
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    // Replace src="avatar.jpg" OR src='avatar.jpg'
    htmlContent = htmlContent.replace(/src=["']avatar\.jpg["']/g, `src="${dataUrl}"`);
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Đã tiêm Base64 Avatar vào HTML thành công!');
} else {
    console.error('❌ Thất bại: Không tìm thấy file nguồn.');
}
