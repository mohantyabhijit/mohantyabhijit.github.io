+++
title = "Creating Cute Childhood Moments With ChatGPT Image Generation"
date = 2026-06-28T17:20:00+08:00
description = "The prompt I used to turn childhood photos of me, my wife, and our cat into warm, believable vintage family-photo moments."
tags = ["ai", "chatgpt", "image-generation", "prompting", "personal"]
slug = "cute-childhood-photo-moments-chatgpt-image-generation"
draft = false
+++

I had three photos: one of me as a child, one of my wife as a child, and one of our cat.

They were all taken at different times, in different places, with different cameras. But I wanted to see something sweet: what if all three of us had been in the same childhood memory?

Not a collage. Not a glossy AI fantasy. Just a believable old family photo where two children and a cat look like they naturally belonged in the same room.

That was the whole idea.

If you just want the reusable prompt, it is at the end of this post: [copy the prompt](#copy-the-prompt).

## The Original Photos And The Results

These were the three reference photos I used.

| My childhood photo | My wife's childhood photo | Our cat |
|---|---|---|
| ![Original childhood photo of me in a mint blue outfit](/images/cute-childhood-photo-moments/original-boy.jpg) | ![Original childhood photo of my wife in a pink frilly dress](/images/cute-childhood-photo-moments/original-girl.jpg) | ![Original photo of our tabby and white cat](/images/cute-childhood-photo-moments/original-cat.jpg) |

And these were the three generated moments from the prompt.

| Together naturally | Whispering the joke | Laughing together |
|---|---|---|
| ![Generated vintage-style photo of two children holding hands with a cat nearby](/images/cute-childhood-photo-moments/transformed-together.jpg) | ![Generated vintage-style photo of the girl whispering to the boy with the cat nearby](/images/cute-childhood-photo-moments/transformed-whisper.jpg) | ![Generated vintage-style photo of both children laughing with the cat nearby](/images/cute-childhood-photo-moments/transformed-laughing.jpg) |

## What I Was Trying To Make

The goal was not to make new versions of us. It was to preserve the source photos as much as possible and only change the scene around them.

The details mattered:

- the real face shape and expression from the childhood photos
- the original clothes
- the same age and body proportions
- the cat's actual markings and size
- lighting that matched the old-photo look
- poses that felt innocent, candid, and family-photo-like

The hardest part with image generation is that it tends to "improve" people. It smooths faces, changes outfits, invents better lighting, makes children look older, or turns a real memory into something too polished.

So the prompt had to be strict. It had to keep saying: preserve identity, preserve outfits, preserve proportions, make it look like a real vintage photo, and avoid the obvious AI mistakes.

## The Three Moments

I asked for three separate images, each built from the same references.

The first one is simple: we are standing together, holding hands, with the cat nearby. The kind of photo a parent might have taken before everyone got distracted.

The second is more playful: my wife as a child leaning in and whispering something funny to me. It has to look gentle and believable, not staged or awkward.

The third is the payoff: both of us laughing after the joke, with the cat still calmly present in the scene.

That small sequence makes the images feel less like random generations and more like a tiny memory.

## Why The Prompt Works

The prompt does a few things that are easy to skip.

It tells the model what not to change. That is just as important as telling it what to create. When you are working from personal reference photos, identity drift is the main failure mode.

It also asks for separate images instead of a collage. This matters because a collage makes the result feel like a design artifact. A single realistic frame feels more like something that could have existed.

Finally, it names the common failure cases directly: extra fingers, warped hands, mismatched lighting, pasted-in subjects, wrong cat markings, adult-looking faces, and over-polished skin. Image models still make those mistakes, so it helps to be explicit.

## Copy The Prompt

Upload three reference photos to ChatGPT or your image-generation tool first:

1. a childhood photo of the girl
2. a childhood photo of the boy
3. a photo of the cat

Then copy and paste this prompt.

```text
I will upload three reference photos:

1. a childhood photo of the girl,
2. a childhood photo of the boy,
3. a photo of our cat.

Create three separate realistic images, not a collage or triptych. Each image should look like a real photo that could have originally been taken with the boy, girl, and cat together in the same place.

Use the uploaded photos as strict identity references. Preserve the real appearance of the girl, boy, and cat as closely as possible: their faces, skin tones, hairstyles, facial features, expressions, body proportions, age, clothing, and natural details from the source photos. Do not make them look like different people. Do not modernize them, age them up, beautify them, or change their outfits.

The girl should match the uploaded childhood photo: curly dark hair, real face shape, skin tone, calm features, pink frilly dress, necklace/details, and original vintage-photo look.
The boy should match the uploaded childhood photo: short hair, real face shape, skin tone, forehead mark, mint/light blue outfit, sandals, proportions, and original vintage-photo look.
The cat should match the uploaded cat photo: tabby-and-white fur, face shape, ears, markings, size, calm expression, and natural body proportions.

Use the best-quality or most natural-looking human photo as the base environment, preferably the simple indoor wall/floor setting if it fits best. Blend the other person and the cat into that same scene naturally. Match lighting, shadows, color temperature, camera angle, grain, sharpness, perspective, and distance from the camera so the final images look like real vintage family photos, not edited composites.

Keep the boy and girl approximately the same height in all three images while still preserving their natural childhood body proportions. Their hands, arms, faces, eyes, mouths, and clothing must remain realistic and undistorted.

Because the reference photos show them as children, keep the mood innocent, warm, playful, and family-photo-like. Avoid adult romantic styling. The pose should feel like a sweet childhood memory: natural, candid, emotional, and believable.

Generate these three separate photo variations:

Image 1: Together naturally

The boy and girl stand close together in the same scene, holding hands naturally. Their hands should be clearly connected, realistic, correctly proportioned, and free of extra fingers or warped shapes. Their posture should feel relaxed and warm, like a real childhood photo. The cat should sit or stand near them naturally with correct scale, contact shadows, and matching lighting.

Image 2: Girl whispering to the boy

The girl leans slightly toward the boy and whispers something funny into his ear. The boy should react naturally, as if listening. Keep both faces recognizable from the source photos. The pose should be believable and gentle, with no distorted necks, faces, hands, or awkward body positions. The cat should remain naturally included nearby, matching the scene.

Image 3: Both laughing at the joke

The boy and girl are now laughing together after the whisper. Their smiles should look natural and childlike, not exaggerated or artificial. Preserve their actual facial identity while changing only the expression enough to show genuine laughter. Keep their bodies close together, relaxed, and approximately the same height. The cat should remain present in a realistic position, calmly sitting or standing nearby.

For all three images, use subtle vintage-photo color correction, soft shadows, realistic contact lighting, mild film grain, and natural imperfections consistent with old family photographs. The final images should look like authentic high-quality restored childhood photos taken on a phone or camera, not AI art.

Avoid: visible cutout edges, mismatched lighting, pasted-in subjects, distorted faces, strange eyes, unnatural smiles, warped bodies, extra fingers, missing fingers, unrealistic hands, oversized cat, wrong cat markings, changed outfits, changed hairstyles, adult-looking versions, cartoon style, glamour style, overly polished skin, or obvious AI artifacts.
```

## A Small Note

This works best when the reference photos are clear and emotionally specific. A simple childhood photo with a plain background often beats a more dramatic photo, because the model has fewer things to reconcile.

The result I liked most was not the most technically perfect one. It was the one that felt like it could have been tucked into an old family album.
