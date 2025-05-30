import React from "react";
import Layout from "../components/Layout/Layout";

const About = () => {
    return (
        <Layout>
             <div className="row aboutus">
                            <div className="col-md-6">
                                <img
                                src="/illustratedonlinemarketingwebpagetemplate796031015.avif"
                                alt="aboutus"
                                style={{width: " 80%" }}
                             />
                          </div>
                          <div className="col-md-4">
                          <h1 className="bg-dark-p-2 text-while text-center">About US</h1>
                          <p className="text-justify mt-2">
                            The about page on your eCommerce website should be more than just an afterthought. This is especially true considering the about page is the second most visited page on websites, just after home pages.
                            Beyond that, the goals of your about page should include:

                            Telling a story of your eCommerce company and why your company matters
                            Providing insight into the leadership of your company
                            Showing off your business model
                            Presenting any interesting stats
                            Using persuasive content to delve deeper into your story
                          </p>
                           </div>
                          </div>
        </Layout>
    );
};

export default About;