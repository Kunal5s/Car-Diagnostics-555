import { slugify } from "./utils";

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  slug: string;
}

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi et per. Nam acnunc. Aenean vel massa quis mauris vehicula lacinia. Quisque tincidunt scelerisque libero. Duis risus. Pellentesque commodo, ipsum eu eleifend assa, enim id lorem. Aliquam erat volutpat. In id velit quis magna pres. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.

Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed non quam. In vel mi sit amet turpis porta vestibulum. Vestibulum laoreet, nunc non pulvinar commodo, urna magna posuere lacus, ut eleifend enim sem sit amet nulla. Sed a libero. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In iaculis por enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse sollicitudin velit sed leo. Ut pharetra augue nec augue. Nam elit agna,endrerit sit amet, tincidunt ac, viverra sed, nulla. Donec porta diam eu massa. Quisque diam lorem, interdum vitae,dapibus ac, scelerisque vitae, pede. Donec eget tellus non erat lacinia fermentum. Donec in velit vel ipsum auctor pulvinar. Vestibulum iaculis lacinia est. Proin dictum elementum velit. Fusce euismod consequat ante. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque sed dolor. Aliquam congue fermentum nisl.

Mauris accumsan nulla vel diam. Sed in lacus ut enim adipiscing aliquet. Nulla venenatis. In pede mi, aliquet sit amet, euismod in,auctor ut, ligula. Aliquam dapibus tincidunt metus. Praesent justo dolor, lobortis quis, lobortis dignissim, pulvinar ac, lorem. Vestibulum sed ante. Donec sagittis euismod purus. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam. Sorbi et per. Nam acnunc. Aenean vel massa quis mauris vehicula lacinia. Quisque tincidunt scelerisque libero. Duis risus. Pellentesque commodo, ipsum eu eleifend assa, enim id lorem. Aliquam erat volutpat. In id velit quis magna pres. Cras suscipit, urna at aliquam rhoncus, urna quam viverra nisi, in interdum massa nibh nec erat.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.

Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc. Sed non quam. In vel mi sit amet turpis porta vestibulum. Vestibulum laoreet, nunc non pulvinar commodo, urna magna posuere lacus, ut eleifend enim sem sit amet nulla. Sed a libero. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In iaculis por enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse sollicitudin velit sed leo. Ut pharetra augue nec augue. Nam elit agna,endrerit sit amet, tincidunt ac, viverra sed, nulla. Donec porta diam eu massa. Quisque diam lorem, interdum vitae,dapibus ac, scelerisque vitae, pede. Donec eget tellus non erat lacinia fermentum. Donec in velit vel ipsum auctor pulvinar. Vestibulum iaculis lacinia est. Proin dictum elementum velit. Fusce euismod consequat ante. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Pellentesque sed dolor. Aliquam congue fermentum nisl.

Mauris accumsan nulla vel diam. Sed in lacus ut enim adipiscing aliquet. Nulla venenatis. In pede mi, aliquet sit amet, euismod in,auctor ut, ligula. Aliquam dapibus tincidunt metus. Praesent justo dolor, lobortis quis, lobortis dignissim, pulvinar ac, lorem. Vestibulum sed ante. Donec sagittis euismod purus. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. This is the 1600 word article content.`;

const articlesData: Omit<Article, "slug">[] = [
  // Engine
  {
    id: 1,
    title: "Understanding Why Your Modern Car Engine Misfires And How To Fix",
    category: "Engine",
    summary: "A deep dive into the common causes of engine misfires.",
    content: `Engine misfires can be a frustrating and concerning issue for any car owner. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Diagnosing Your Car's Overheating Engine Issues",
    category: "Engine",
    summary: "Learn how to identify and resolve engine overheating problems effectively.",
    content: `An overheating engine is a serious problem that requires immediate attention. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 3,
    title: "How to Tell if Your Car's Timing Belt Needs Replacement",
    category: "Engine",
    summary: "Recognize the warning signs of a failing timing belt now.",
    content: `The timing belt is a critical component of your engine. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 4,
    title: "Decoding The Meaning Behind Your Car Engine's Strange Noises Now",
    category: "Engine",
    summary: "A comprehensive guide to identifying engine noises and their causes.",
    content: `Unusual noises from your engine can indicate a variety of problems. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 5,
    title: "Top Five Reasons Your Car's Check Engine Light Is On",
    category: "Engine",
    summary: "Explore the most common culprits behind that persistent check engine light.",
    content: `The check engine light can be intimidating, but it's there to help. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 6,
    title: "A Complete Maintenance Checklist For Your Modern Vehicle's Powerful Engine",
    category: "Engine",
    summary: "Keep your engine running smoothly with this essential maintenance checklist.",
    content: `Regular engine maintenance is key to your vehicle's longevity and performance. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },

  // Sensors
  {
    id: 7,
    title: "How to Test and Replace a Faulty Oxygen Sensor Today",
    category: "Sensors",
    summary: "A step-by-step guide on managing your car's O2 sensors.",
    content: `A faulty oxygen sensor can negatively impact your fuel economy. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 8,
    title: "The Role of the Mass Airflow Sensor in Your Vehicle",
    category: "Sensors",
    summary: "Understand the importance of the MAF sensor for engine performance.",
    content: `The Mass Airflow (MAF) sensor is crucial for maintaining performance. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 9,
    title: "Diagnosing Problems With Your Car's Essential Throttle Position Sensor Now",
    category: "Sensors",
    summary: "Learn to spot and fix issues with the throttle position sensor.",
    content: `The throttle position sensor plays a key role in engine management. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 10,
    title: "Understanding Your Car's Coolant Temperature Sensor and Its Common Failures",
    category: "Sensors",
    summary: "A guide to the coolant temperature sensor and its functions.",
    content: `The coolant temperature sensor is vital for engine operation. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 11,
    title: "Everything You Need to Know About Crankshaft Position Sensors Today",
    category: "Sensors",
    summary: "An in-depth look at the crankshaft position sensor's role.",
    content: `The crankshaft position sensor is a critical component for engine timing. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 12,
    title: "Common Symptoms Of A Failing Manifold Absolute Pressure MAP Sensor",
    category: "Sensors",
    summary: "Identify the signs of a bad MAP sensor to prevent issues.",
    content: `The MAP sensor provides important data to the engine control unit. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },

  // OBD2
  {
    id: 13,
    title: "A Beginner's Guide to Using an OBD2 Scanner Correctly",
    category: "OBD2",
    summary: "Learn the basics of using an OBD2 scanner for diagnostics.",
    content: `An OBD2 scanner is a powerful tool for any car owner. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 14,
    title: "Top 10 Most Common OBD2 Codes and What They Mean",
    category: "OBD2",
    summary: "A breakdown of the most frequent OBD2 diagnostic trouble codes.",
    content: `Understanding common OBD2 codes can save you time and money. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 15,
    title: "How to Clear OBD2 Codes After a Successful Repair Job",
    category: "OBD2",
    summary: "The proper procedure for resetting your car's diagnostic trouble codes.",
    content: `Clearing OBD2 codes is the final step after a repair. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 16,
    title: "Advanced OBD2 Diagnostics: Understanding Live Data And Freeze Frame Information",
    category: "OBD2",
    summary: "Go beyond basic codes with live data and freeze frames.",
    content: `Advanced OBD2 features provide deeper insight into your vehicle's health. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 17,
    title: "Choosing the Best OBD2 Scanner for Your Specific Needs Today",
    category: "OBD2",
    summary: "A guide to selecting the right diagnostic tool for you.",
    content: `With so many OBD2 scanners on the market, choosing one can be tough. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 18,
    title: "The Difference Between Generic And Manufacturer-Specific OBD2 Codes Explained Here",
    category: "OBD2",
    summary: "Learn about the two main types of diagnostic trouble codes.",
    content: `Not all OBD2 codes are created equal; some are manufacturer-specific. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  
  // EVs
  {
    id: 19,
    title: "Understanding Electric Vehicle Battery Health And Maximizing Its Lifespan Now",
    category: "EVs",
    summary: "Tips and tricks for keeping your EV's battery in top condition.",
    content: `An EV's battery is its most important and expensive component. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 20,
    title: "Common Maintenance Tasks For Electric Vehicles You Should Know About",
    category: "EVs",
    summary: "A look at the routine maintenance required for electric cars.",
    content: `While EVs have fewer moving parts, they still require maintenance. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: 21,
    title: "How Regenerative Braking Works In An Electric Vehicle System",
    category: "EVs",
    summary: "An explanation of the technology that helps extend EV range.",
    content: `Regenerative braking is a key feature of modern electric vehicles. ${loremIpsum}`,
    imageUrl: "https://placehold.co/600x400.png",
  },
];


export const articles: Article[] = articlesData.map(article => ({
  ...article,
  slug: `${slugify(article.title)}-${article.id}`
}));

export const categories = [
  "All",
  "Engine",
  "Sensors",
  "OBD2",
  "Alerts",
  "Apps",
  "Maintenance",
  "Fuel",
  "EVs",
  "Trends",
];
