import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createExperience, getExperience, listExperiences } from '@/lib/experience-store';
import { journeyBrandMap } from '@/lib/brands';
import type { JourneyType } from '@/lib/brands';

const MAX_IMAGES = 10;
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB base64

export async function POST(request: NextRequest) {
  try {
    const { name, journeyType, structuredContext, contextImages, format } = await request.json();

    if (!name || !journeyType) {
      return NextResponse.json({ error: 'Name and journey type are required' }, { status: 400 });
    }

    // Validate images
    const validImages = (contextImages ?? [])
      .filter((img: string) => typeof img === 'string' && img.startsWith('data:image/'))
      .filter((img: string) => img.length < MAX_IMAGE_SIZE)
      .slice(0, MAX_IMAGES);

    const ctx = structuredContext ?? {};
    const operatorContext = [
      ctx.who && `WHO: ${ctx.who}`,
      ctx.values && `VALUES: ${ctx.values}`,
      ctx.intention && `INTENTION: ${ctx.intention}`,
      ctx.additional && `ADDITIONAL: ${ctx.additional}`,
    ].filter(Boolean).join('\n') || 'No context provided';

    const firstName = name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'person';
    const slug = `${firstName}-${nanoid(6)}`;
    const brand = journeyBrandMap[journeyType as JourneyType];

    if (!brand) {
      return NextResponse.json({ error: 'Invalid journey type' }, { status: 400 });
    }

    const experience = await createExperience({
      slug, name,
      journeyType: journeyType as JourneyType,
      brand, operatorContext,
      structuredContext: ctx,
      contextImages: validImages,
      format: format ?? { depth: 'standard', questionCount: 5, reportStyle: 'report', suggestedReason: '' },
    });

    return NextResponse.json({
      slug: experience.slug,
      experienceUrl: `/e/${experience.slug}`,
      operatorUrl: `/r/${experience.slug}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience: ' + String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const experience = await getExperience(slug);
    if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(experience);
  }

  const experiences = await listExperiences();
  return NextResponse.json(experiences);
}
