import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
interface TweetCardProps {
    content: string;
  }
  
  const TweetCard: React.FC<TweetCardProps> = ({ content }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thread</CardTitle>
                <CardDescription>Here is the generated Thread</CardDescription>
            </CardHeader>
            <CardContent>
                <p>{content}</p>
            </CardContent>
            
        </Card>

    )
}

export default TweetCard