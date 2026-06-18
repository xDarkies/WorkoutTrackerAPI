import {PrismaClient, Category} from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString =`${process.env.DATABASE_URL!}`
const pool = new Pool({connectionString})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({adapter})

const main = async () => {
    console.log('Starting database seeding...');

    const exercises = [
        {
            name: 'Barbell Squat',
            description: 'A compound lower-body exercise targeting the quadriceps, hamstrings, and glutes.',
            category: Category.Strength,
        },
        {
            name: 'Push-Up',
            description: 'A classic bodyweight exercise targeting the chest, shoulders, and triceps.',
            category: Category.Strength,
        },
        {
            name: 'Deadlift',
            description: 'A fundamental compound lift that engages the entire posterior chain, including the back, glutes, and hamstrings.',
            category: Category.Strength,
        },
        {
            name: 'Pull-Up',
            description: 'An upper-body pulling exercise that primarily targets the latissimus dorsi and biceps.',
            category: Category.Strength,
        },
        {
            name: 'Dumbbell Shoulder Press',
            description: 'An overhead pressing movement designed to build strength and stability in the deltoids.',
            category: Category.Strength,
        },
        {
            name: 'Bench Press',
            description: 'A foundational upper-body pressing exercise targeting the pectoral muscles, anterior deltoids, and triceps.',
            category: Category.Strength,
        },
        {
            name: 'Barbell Row',
            description: 'A compound pulling movement that strengthens the upper back, rhomboids, and lats.',
            category: Category.Strength,
        },
        {
            name: 'Lunges',
            description: 'A unilateral lower-body exercise that improves balance and strengthens the quads and glutes.',
            category: Category.Strength,
        },
        {
            name: 'Plank',
            description: 'An isometric core exercise that builds endurance throughout the abdominals and lower back.',
            category: Category.Strength,
        },
        {
            name: 'Bicep Curl',
            description: 'An isolation exercise focused on building strength in the biceps brachii.',
            category: Category.Strength,
        },

        // --- CARDIO ---
        {
            name: 'Running',
            description: 'Continuous running at a steady pace to improve cardiovascular endurance and aerobic capacity.',
            category: Category.Cardio,
        },
        {
            name: 'Jump Rope',
            description: 'A high-intensity, high-impact cardiovascular exercise that enhances coordination and agility.',
            category: Category.Cardio,
        },
        {
            name: 'Jumping Jacks',
            description: 'A full-body calisthenic exercise that raises the heart rate and improves conditioning.',
            category: Category.Cardio,
        },
        {
            name: 'Burpees',
            description: 'A full-body, multi-joint exercise combining a squat, push-up, and vertical jump for metabolic conditioning.',
            category: Category.Cardio,
        },
        {
            name: 'Mountain Climbers',
            description: 'A dynamic exercise that combines core stability with rapid leg movements to elevate the heart rate.',
            category: Category.Cardio,
        },
        {
            name: 'High Knees',
            description: 'A cardio-intensive running-in-place variation that emphasizes hip flexor activation and speed.',
            category: Category.Cardio,
        },
        {
            name: 'Cycling',
            description: 'A low-impact cardiovascular exercise targeting lower-body endurance via a stationary or road bike.',
            category: Category.Cardio,
        },
        {
            name: 'Rowing Machine',
            description: 'A full-body cardiovascular workout that engages both the upper and lower body simultaneously.',
            category: Category.Cardio,
        },

        // --- FLEXIBILITY ---
        {
            name: 'Yoga Sun Salutation',
            description: 'A fluid sequence of traditional yoga poses designed to improve full-body flexibility and circulation.',
            category: Category.Flexibility,
        },
        {
            name: 'Child Pose',
            description: 'A resting yoga posture that gently stretches the lower back, hips, thighs, and ankles.',
            category: Category.Flexibility,
        },
        {
            name: 'Downward-Facing Dog',
            description: 'An inversion posture that lengthens the spine and stretches the hamstrings and calves.',
            category: Category.Flexibility,
        },
        {
            name: 'Hamstring Stretch',
            description: 'A seated or standing static stretch aimed at increasing the range of motion in the back of the thighs.',
            category: Category.Flexibility,
        },
        {
            name: 'Cobra Stretch',
            description: 'A prone backward-bending stretch that opens up the chest and increases spinal flexibility.',
            category: Category.Flexibility,
        },
        {
            name: 'Cat-Cow Stretch',
            description: 'A gentle, synchronous movement that improves mobility and relieves tension in the spine.',
            category: Category.Flexibility,
        },
        {
            name: 'Butterfly Stretch',
            description: 'A seated stretch targeting the groin, inner thighs, and hips to improve joint mobility.',
            category: Category.Flexibility,
        },
        ];
    for(const exercise of exercises){
        await prisma.exercise.upsert(
            {where: {name: exercise.name},
            update: {},
            create: exercise}
        )
    }
    console.log('Seeding completed');
}   
main()
    .then(async ()=>{
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
    });