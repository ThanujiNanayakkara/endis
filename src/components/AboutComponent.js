import React, {Component} from 'react';

class About extends Component{

    render(){
        return(
            <div>
                <div className="about-top">

                    <br></br>
                    <h1 className="text-center">About Us</h1>
                    <p>In this exercise, the idea is to write a paragraph that would be a random passage 
                        from a story. An effective paragraph is one that has unity (it isn’t a hodgepodge 
                        of things), focus (everything in the paragraph stacks up to the whatever-it-is the 
                        paragraph is about), and coherence (the content follows smoothly). For this exercise, 
                        the paragraph should be quick to read--say, not be more than 100 words long. A 
                        paragraph needn’t be several sentences long, but might be only a sentence or two, 
                        or a single line of dialogue.</p>
                        
                </div>

                <div className="about-bottom">

                    <div class="col-10 mt-3" >
                        <div class="card card-shadow">
                            <div class="card-horizontal post-about" >
                                <img class="" src="assets/images/about_city.jpg" alt="Card image cap" height="250px"/>
                                <div class="card-body">
                                    <h4 class="card-title">Card title</h4>
                                    <p class="card-text">
                                        In this exercise, the idea is to write a paragraph that would be a random passage 
                                        from a story. An effective paragraph is one that has unity (it isn’t a hodgepodge 
                                        of things), focus (everything in the paragraph stacks up to the whatever-it-is the 
                                        paragraph is about), and coherence (the content follows smoothly). For this exercise, 
                                        the paragraph should be quick to read--say, not be more than 100 words long.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>

                    <div className="row">
                        <div className="col-2"></div>
                        <div class="col-10 mt-3">
                            <div class="card card-shadow">
                                <div class="card-horizontal post-about">
                                    <div class="card-body" >
                                        <h4 class="card-title">Card title</h4>
                                        <p class="card-text">
                                            In this exercise, the idea is to write a paragraph that would be a random passage 
                                            from a story. An effective paragraph is one that has unity (it isn’t a hodgepodge 
                                            of things), focus (everything in the paragraph stacks up to the whatever-it-is the 
                                            paragraph is about), and coherence (the content follows smoothly). For this exercise, 
                                            the paragraph should be quick to read--say, not be more than 100 words long.
                                        </p>
                                    </div>
                                    <img class="" src="assets/images/about_forest.jpg" alt="Card image cap" height="250px"/>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>

                    <div class="col-10 mt-3 mb-3">
                        <div class="card card-shadow">
                            <div class="card-horizontal post-about">
                                <img class="" src="assets/images/about_power.jpg" alt="Card image cap" height="250px"/>
                                <div class="card-body">
                                    <h4 class="card-title">Card title</h4>
                                    <p class="card-text">
                                        In this exercise, the idea is to write a paragraph that would be a random passage 
                                        from a story. An effective paragraph is one that has unity (it isn’t a hodgepodge 
                                        of things), focus (everything in the paragraph stacks up to the whatever-it-is the 
                                        paragraph is about), and coherence (the content follows smoothly). For this exercise, 
                                        the paragraph should be quick to read--say, not be more than 100 words long.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
        
    }
}

export default About;
