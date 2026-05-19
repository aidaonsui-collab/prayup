export type MoodId = 'anxious' | 'weary' | 'searching' | 'hopeful' | 'grateful' | 'joyful';

export type Mood = { id: MoodId; label: string; tone: string; sub: string };

export const MOODS: Mood[] = [
  { id: 'anxious',   label: 'Anxious',   tone: '#A8B7C9', sub: 'My mind is restless' },
  { id: 'weary',     label: 'Weary',     tone: '#B8A78D', sub: 'I feel heavy today' },
  { id: 'searching', label: 'Searching', tone: '#7C8B7A', sub: "I'm looking for direction" },
  { id: 'hopeful',   label: 'Hopeful',   tone: '#C9A227', sub: 'Something is stirring' },
  { id: 'grateful',  label: 'Grateful',  tone: '#D4B96B', sub: 'My cup is full' },
  { id: 'joyful',    label: 'Joyful',    tone: '#E8D38A', sub: 'Light is breaking through' },
];

export type Verse = { body: string; ref: string; book: string };

export const VERSE_BY_MOOD: Record<MoodId, Verse> = {
  anxious:   { body: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', ref: 'Philippians 4:6', book: 'Philippians' },
  weary:     { body: 'Come to me, all you who are weary and burdened, and I will give you rest.', ref: 'Matthew 11:28', book: 'Matthew' },
  searching: { body: 'Trust in the Lord with all your heart, and lean not on your own understanding.', ref: 'Proverbs 3:5', book: 'Proverbs' },
  hopeful:   { body: 'For I know the plans I have for you, plans to prosper and not to harm, plans to give you hope and a future.', ref: 'Jeremiah 29:11', book: 'Jeremiah' },
  grateful:  { body: 'Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.', ref: '1 Thessalonians 5:18', book: '1 Thessalonians' },
  joyful:    { body: 'This is the day that the Lord has made; let us rejoice and be glad in it.', ref: 'Psalm 118:24', book: 'Psalm' },
};

export type TemplateId = 'personal' | 'gratitude' | 'surrender' | 'guidance' | 'peace';

export type PrayerTemplate = {
  id: TemplateId;
  label: string;
  kind: 'Personalized' | 'Classic';
  sub: string;
  text?: string;
};

export const PRAYER_TEMPLATES: PrayerTemplate[] = [
  {
    id: 'personal', label: 'For me, today', kind: 'Personalized',
    sub: 'Shaped by what you brought.',
  },
  {
    id: 'gratitude', label: 'Gratitude', kind: 'Classic',
    sub: 'Begin with thanks.',
    text: 'Father, before I ask for anything, I want to thank You. For breath I did not earn. For mercy that meets me again this morning. For people who love me, for the work in front of me, for the small ordinary gifts already in my hands. Let gratitude shape how I move through this day — patient, generous, quick to notice what You are doing. Whatever the day holds, You are good. Whatever I do not have, You are enough.',
  },
  {
    id: 'surrender', label: 'Surrender', kind: 'Classic',
    sub: 'Open your hands.',
    text: 'Father, I open my hands. The weights I have been holding — the outcomes I have been gripping, the people I cannot fix, the future I cannot see — I give them to You. Not because I no longer care, but because You care more. Take what is too heavy for me. Hold what is too uncertain. I trust You with what I love most. Have Your way. Lead me where I would not lead myself.',
  },
  {
    id: 'guidance', label: 'Guidance', kind: 'Classic',
    sub: 'Ask for the next small step.',
    text: 'Father, I do not need the whole map today. Just the next step. Quiet the voices that pull at me. Make my path clear enough to walk. Where I am tempted to rush, slow me down. Where I am tempted to delay, give me courage. Let Your Word be a lamp under my feet today, not a floodlight on the horizon. I would rather walk slowly with You than fast without You.',
  },
  {
    id: 'peace', label: 'Peace', kind: 'Classic',
    sub: 'Quiet the noise.',
    text: 'Father, the world is loud and my mind is louder. Settle me. Slow my breathing. Loosen what is clenched. Trade my anxious thoughts for the peace that does not depend on circumstance. Be the calm at the center of this day. When the noise rises, remind me where to return. You are near. I do not have to carry anything alone.',
  },
];

export const PRAYER_BY_MOOD: Record<MoodId, string> = {
  anxious:   'Father, I come to You restless. My mind has been running ahead of me, carrying weights You never asked me to hold. Quiet this noise. Anchor me in the truth that You see what I cannot see, and that nothing in my day surprises You. Trade my anxious thoughts for Your peace — the peace that guards my heart and my mind. Help me walk forward, one breath at a time, with You.',
  weary:     'Father, I am tired. The day already feels long, and I have so little to give. Thank You for not asking me to be strong on my own. Carry what I cannot carry. Lift my eyes from what is heavy to the One who is gentle and humble in heart. Refresh me with Your nearness. Be the rest I have been chasing in lesser places.',
  searching: 'Father, I do not know the way from here. Some doors look open and I cannot tell which is Yours. Quiet the voices competing for my trust. Lead me by what I see in Your Word and the peace You give. Make my next small step clear. I would rather walk slowly with You than fast without You.',
  hopeful:   'Father, something is stirring in me today, and I want to bring it to You first. Thank You that hope is not naive when it is rooted in You. Steward what You are starting. Let me hold it with open hands — not gripping, not rushing — and trust You to grow what is meant to grow.',
  grateful:  'Father, my cup is full and I want to say so before I say anything else. Thank You. For mercy I did not earn. For people who love me. For the small ordinary mercies of this morning. Let gratitude shape how I move through this day — patient with others, slow to complain, quick to notice the gifts already in my hands.',
  joyful:    'Father, today feels like light, and I want to give the joy back to You before I spend it on anything else. You made this day; let me not waste it. Let my joy be useful — kind to the person in front of me, generous to someone who needs a word, quick to praise You out loud.',
};

export const INTENTION_SUGGESTIONS = [
  'Be still',
  'Trust',
  'Listen first',
  'Hold loosely',
  'Be present',
  'Choose kindness',
  'Move slowly',
  'Stay open',
];
