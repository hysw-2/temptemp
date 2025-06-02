import apiClient from "../apiClient";

// 검색 조건에 따라 API endpoint URL을 구성
export const searchBills = async (type, query, page = 0, size = 10) => {
    const encodedQuery = encodeURIComponent(query);
    let url = "";

    if (type === "billTitle") {
        url = `/bills/search?title=${encodedQuery}&page=${page}&size=${size}`;
    } else if (type === "proposers") {
        url = `/proposers/search?keyword=${encodedQuery}&page=${page}&size=${size}`;
    } else {
        throw new Error("지원하지 않는 검색 타입입니다.");
    }

    const response = await apiClient.get(url);
    return response.data;
};

// 사용자 친화적인 검색 설명 포맷
export const formatSearchQuery = (type, query) => {
    if (type === "billTitle") return `"${query}"에 대한 법안명`;
    if (type === "proposers") return `"${query}"에 대한 발의자`;
    return `"${query}"에 대한 결과`;
};
