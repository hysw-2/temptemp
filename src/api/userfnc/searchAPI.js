import apiClient from "../apiClient";

// 검색 API 관련 함수들
export const searchBills = async (searchType, query) => {
    try {
        let endpoint = '';
        
        switch (searchType) {
            case 'billTitle':
                endpoint = `/api/bills/search?title=${encodeURIComponent(query)}`;
                break;
            case 'proposers':
                endpoint = `/api/proposers/search?keyword=${encodeURIComponent(query)}`;
                break;
            default:
                throw new Error('지원하지 않는 검색 타입입니다.');
        }

        const response = await apiClient.get(endpoint);

        // 응답에서 content만 추출하여 반환
        return response.data?.content ?? [];
    } catch (error) {
        console.error('검색 API 호출 중 오류 발생:', error);
        throw error;
    }
};

// 검색 타입에 따른 검색어 포맷팅 함수
export const formatSearchQuery = (searchType, query) => {
    switch (searchType) {
        case 'billTitle':
            return `법안명: ${query}`;
        case 'proposers':
            return `발의자: ${query}`;
        default:
            return query;
    }
};
