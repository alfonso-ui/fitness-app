import { defineExercise } from './define';

export const coreExercises = [
  defineExercise({
    slug: 'plank',
    name: 'Plank',
    description:
      'The foundational core hold — a straight, braced body supported on forearms and toes.',
    instructions: [
      'Place your forearms on the floor, elbows under your shoulders.',
      'Extend your legs so your body forms a straight line from head to heels.',
      'Brace your core and hold the position while breathing normally.',
    ],
    tips: [
      'Squeeze your glutes and push the floor away with your forearms.',
      'A shorter perfect plank beats a long saggy one.',
    ],
    primaryMuscle: 'core',
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'bodyweight',
    movementPattern: 'core',
    difficulty: 'beginner',
    measurementType: 'duration',
    isUnilateral: false,
    alternatives: ['dead-bug'],
    tags: ['bodyweight', 'isometric', 'home'],
  }),
  defineExercise({
    slug: 'dead-bug',
    name: 'Dead Bug',
    description:
      'A back-friendly core exercise — lying down, you extend opposite arm and leg while keeping your spine still.',
    instructions: [
      'Lie on your back with arms pointing at the ceiling and knees bent 90 degrees over your hips.',
      'Press your lower back gently into the floor.',
      'Slowly extend one arm overhead and the opposite leg out straight.',
      'Return to the start and repeat with the other pair.',
    ],
    tips: [
      'Your lower back must stay in contact with the floor the entire time.',
      'Slow is the whole point — take 3–4 seconds per rep.',
    ],
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    movementPattern: 'core',
    difficulty: 'beginner',
    measurementType: 'reps_only',
    isUnilateral: true,
    alternatives: ['plank'],
    tags: ['bodyweight', 'back-friendly', 'home'],
  }),
  defineExercise({
    slug: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    description:
      'Hang from a bar and lift your knees toward your chest — a strong core and grip builder in one.',
    instructions: [
      'Hang from a pull-up bar with straight arms.',
      'Lift your knees up toward your chest, tilting your pelvis at the top.',
      'Lower your legs under control to a dead hang.',
    ],
    tips: [
      'Avoid swinging — pause briefly at the bottom of each rep.',
      'Progress to straight-leg raises when knee raises get easy.',
    ],
    primaryMuscle: 'core',
    secondaryMuscles: ['forearms'],
    equipment: 'bodyweight',
    movementPattern: 'core',
    difficulty: 'intermediate',
    measurementType: 'reps_only',
    isUnilateral: false,
    alternatives: ['cable-crunch', 'dead-bug'],
    tags: ['bodyweight', 'grip'],
  }),
  defineExercise({
    slug: 'cable-crunch',
    name: 'Cable Crunch',
    description:
      'A kneeling crunch against cable resistance — lets you load the abs progressively like any other muscle.',
    instructions: [
      'Kneel below a high pulley holding a rope attachment beside your head.',
      'Crunch your ribs down toward your pelvis, rounding your upper back.',
      'Return under control until your torso is upright.',
    ],
    tips: [
      'Your hips stay still — the movement is your spine curling, not bowing forward.',
      'Think about pulling your ribs to your hips.',
    ],
    primaryMuscle: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
    movementPattern: 'core',
    difficulty: 'beginner',
    measurementType: 'weight_reps',
    isUnilateral: false,
    alternatives: ['hanging-knee-raise', 'plank'],
    tags: ['cable', 'abs'],
  }),
];
