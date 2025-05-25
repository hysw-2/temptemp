import React, { useState } from 'react';
import { message } from 'antd';
import apiClient from '../api/apiClient';
import pdfIcon from '../assets/icons/pdf.png';

const DownloadPdf = ({ billId }) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/bills/${billId}/link`);
            const { link } = response.data;
            
            // 새 창에서 PDF 링크 열기
            window.open(link, '_blank');
        } catch (error) {
            console.error('PDF 링크를 가져오는 중 오류 발생:', error);
            message.error('PDF 다운로드 링크를 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <img
            src={pdfIcon}
            alt="PDF 다운로드"
            onClick={handleDownload}
            style={{
                width: '24px',
                height: '32px',
                cursor: 'pointer',
                marginLeft: '10px',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.3s'
            }}
        />
    );
};

export default DownloadPdf;
