import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: '検索クエリが必要です' }, { status: 400 });
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API キーが設定されていません' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(query)}&maxResults=25&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API からのレスポンスが不正です');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('YouTube API エラー:', error);
    return NextResponse.json({ error: '検索中にエラーが発生しました' }, { status: 500 });
  }
} 