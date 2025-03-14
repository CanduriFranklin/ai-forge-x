import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Slider } from '@material-ui/core';

const App = () => {
    const [textPrompt, setTextPrompt] = useState('');
    const [maxLength, setMaxLength] = useState(512);
    const [creativity, setCreativity] = useState(0.7);
    const [generatedText, setGeneratedText] = useState('');

    const generateText = async () => {
        try {
            const response = await fetch('http://172.27.232.4:5001/generate-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: textPrompt,
                    max_length: maxLength,
                    creativity: creativity,
                }),
            });

            if (!response.ok) {
                throw new Error('Error generating text');
            }

            const data = await response.json();
            setGeneratedText(data.text);
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating text');
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Image Generator
            </Typography>
            <Card>
                <CardContent>
                    <TextField
                        label="Describe the image you want to generate"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                    />
                    <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                        <FormLabel component="legend">Generation Mode</FormLabel>
                        <RadioGroup row>
                            <FormControlLabel value="static" control={<Radio />} label="Static Image" />
                            <FormControlLabel value="interactive" control={<Radio />} label="Interactive 3D Model" />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        label="Model Type"
                        variant="outlined"
                        fullWidth
                        style={{ marginTop: '20px' }}
                    />
                    <Typography gutterBottom style={{ marginTop: '20px' }}>
                        Customization Settings
                    </Typography>
                    <TextField
                        label="Width"
                        variant="outlined"
                        type="number"
                        fullWidth
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        label="Height"
                        variant="outlined"
                        type="number"
                        fullWidth
                        style={{ marginTop: '10px' }}
                    />
                    <Typography gutterBottom style={{ marginTop: '20px' }}>
                        Steps
                    </Typography>
                    <Slider
                        defaultValue={30}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={100}
                    />
                    <TextField
                        label="Seed"
                        variant="outlined"
                        type="number"
                        fullWidth
                        style={{ marginTop: '20px' }}
                    />
                    <TextField
                        label="Negative Prompt"
                        variant="outlined"
                        fullWidth
                        style={{ marginTop: '20px' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                        onClick={generateText}
                    >
                        Generate Image
                    </Button>
                </CardContent>
            </Card>
            {generatedText && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">Generated Text</Typography>
                        <Typography>{generatedText}</Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default App;
